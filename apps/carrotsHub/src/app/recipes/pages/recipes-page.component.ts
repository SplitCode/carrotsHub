import type { OnInit, AfterViewInit } from "@angular/core";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
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
import { TuiAutoFocusModule } from "@taiga-ui/cdk";
import { RecipesService } from "../../api/services/recipes.service";
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
    TuiAutoFocusModule,
  ],
  templateUrl: "./recipes-page.component.html",
  styleUrl: "./recipes-page.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipesPageComponent implements OnInit, AfterViewInit {
  @ViewChild("searchInput", { read: ElementRef }) searchInput!: ElementRef;
  recipes$: Observable<Recipe[]> = of([]);
  readonly loading = signal(false);
  isSearched = false;

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly recipesService = inject(RecipesService);
  private readonly logger = inject(Logger);

  searchForm = new FormGroup({
    searchControl: new FormControl(""),
  });

  onSearch(query: string) {
    if (query?.trim()) {
      this.isSearched = true;
      this.loading.set(true);

      this.logger.logInfo({
        name: "SearchStarted",
        params: { query },
      });

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { search: query },
        queryParamsHandling: "merge",
      });

      this.recipes$ = this.recipesService.searchRecipes(query).pipe(
        map((data: RecipeResponse) => {
          this.loading.set(false);
          this.logger.logInfo({
            name: "SearchSuccess",
            params: { query, totalResults: data.hits.length },
          });

          this.setFocus();

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

          this.setFocus();

          return of([]);
        })
      );
    } else {
      this.isSearched = false;
      this.recipes$ = of([]);
      this.setFocus();
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
      .subscribe((query) => {
        this.logger.logInfo({
          name: "SearchInputChanged",
          params: { query },
        });

        this.onSearch(query);
      });

    this.route.queryParams.subscribe((params) => {
      const { search: query = "" } = params;
      if (query) {
        this.searchForm.setValue(
          { searchControl: query },
          { emitEvent: false }
        );
        this.isSearched = true;
        this.logger.logInfo({
          name: "PageLoadedWithSearchQuery",
          params: { query },
        });

        this.onSearch(query);
      }
    });
  }

  ngAfterViewInit() {
    this.setFocus();
  }

  private setFocus() {
    if (this.searchInput && this.searchInput.nativeElement) {
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      }, 0);
    }
  }
}
