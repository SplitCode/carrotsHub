import type { OnInit } from "@angular/core";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import type { Observable } from "rxjs";
import {
  catchError,
  of,
  map,
  debounceTime,
  filter,
  distinctUntilChanged,
} from "rxjs";
import { TuiButtonModule, TuiTextfieldControllerModule } from "@taiga-ui/core";
import { TuiInputModule } from "@taiga-ui/kit";
import { Router, ActivatedRoute } from "@angular/router";
import { EdamamService } from "../../api/services/edamam.service";
import type { Recipe } from "../models/recipe.interface";
import { RecipeCardComponent } from "../components/recipe-card/recipe-card.component";
import type { RecipeResponse } from "../../api/models/edamam.interface";
import { Logger } from "../../core/logger/logger.models";
import { LoaderComponent } from "../../shared/components/loader/loader.component";

@Component({
  selector: "app-recipes-page",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiButtonModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    RecipeCardComponent,
    LoaderComponent,
  ],
  templateUrl: "./recipes-page.component.html",
  styleUrl: "./recipes-page.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipesPageComponent implements OnInit {
  @ViewChild("searchInput") searchInput!: ElementRef<HTMLInputElement>;

  recipes$: Observable<Recipe[]> = of([]);
  readonly loading = signal(false);
  isSearched = false;

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly edamamService = inject(EdamamService);
  private readonly logger = inject(Logger);

  searchForm = new FormGroup({
    searchControl: new FormControl(""),
  });

  onSearch(query: string) {
    if (query?.trim()) {
      this.isSearched = true;
      this.loading.set(true);

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { search: query },
        queryParamsHandling: "merge",
      });

      this.recipes$ = this.edamamService.searchRecipes(query).pipe(
        map((data: RecipeResponse) => {
          this.loading.set(false);
          this.logger.logInfo({
            name: "SearchSuccess",
            params: { query, totalResults: data.hits.length },
          });

          setTimeout(() => this.searchInput.nativeElement.focus(), 100);

          return data.hits.map((hit) => ({
            ...hit.recipe,
            uri: hit.recipe.uri,
            label: hit.recipe.label,
            image: hit.recipe.image,
            calories: hit.recipe.calories,
            yield: hit.recipe.yield,
            fat: hit.recipe.digest[0]?.total || 0,
            carbs: hit.recipe.digest[1]?.total || 0,
            protein: hit.recipe.digest[2]?.total || 0,
          }));
        }),
        catchError((error) => {
          this.loading.set(false);
          this.logger.logError({
            name: "SearchFailed",
            params: { query, error },
          });
          this.isSearched = true;

          setTimeout(() => this.searchInput.nativeElement.focus(), 100);
          return of([]);
        })
      );
    } else {
      this.isSearched = false;
      this.recipes$ = of([]);

      setTimeout(() => this.searchInput.nativeElement.focus(), 100);
    }
  }

  ngOnInit() {
    this.searchForm
      .get("searchControl")
      ?.valueChanges.pipe(
        debounceTime(300),
        map((query) => query || ""),
        filter((query: string) => query.trim().length >= 3),
        distinctUntilChanged()
      )
      .subscribe((query) => this.onSearch(query));

    this.route.queryParams.subscribe((params) => {
      const { search: query = "" } = params;
      if (query) {
        this.searchForm.setValue(
          { searchControl: query },
          { emitEvent: false }
        );
        this.isSearched = true;
        this.onSearch(query);
      }
    });
  }
}
