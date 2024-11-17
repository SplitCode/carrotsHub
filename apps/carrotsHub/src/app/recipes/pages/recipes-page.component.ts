import type { OnInit } from "@angular/core";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { catchError, debounceTime, of, switchMap } from "rxjs";
import { EdamamService } from "../../api/services/edamam.service";

@Component({
  selector: "app-recipes-page",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./recipes-page.component.html",
  styleUrl: "./recipes-page.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipesPageComponent implements OnInit {
  // searchForm = new FormGroup({
  //   searchControl: new FormControl(""),
  // });

  searchControl = new FormControl("");
  recipes: any[] = [];

  private readonly edamamService = inject(EdamamService);
  private readonly router = inject(Router);

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((query) => this.edamamService.searchRecipes(query || "")),
        catchError((error) => {
          console.error("Ошибка при получении рецептов:", error);
          return of({ hits: [] });
        })
      )
      .subscribe((data) => {
        this.recipes = data.hits.map((hit: any) => hit.recipe);
      });
  }

  openRecipeDetail(recipeUri: string) {
    const recipeId = encodeURIComponent(recipeUri);
    this.router.navigate(["/recipe", recipeId]);
  }
}
