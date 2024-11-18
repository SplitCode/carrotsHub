import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import type { Observable } from "rxjs";
import { catchError, of, map } from "rxjs";
import {
  TuiButtonModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from "@taiga-ui/core";
import { TuiInputModule } from "@taiga-ui/kit";
import { EdamamService } from "../../api/services/edamam.service";
import type { Recipe } from "../models/recipe.interface";

@Component({
  selector: "app-recipes-page",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiButtonModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiSvgModule,
  ],
  templateUrl: "./recipes-page.component.html",
  styleUrl: "./recipes-page.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipesPageComponent {
  searchForm = new FormGroup({
    searchControl: new FormControl(""),
  });

  recipes$: Observable<Recipe[]> = of([]);

  private readonly edamamService = inject(EdamamService);
  private readonly router = inject(Router);

  onSearch() {
    const query = this.searchForm.get("searchControl")?.value;

    if (query?.trim()) {
      this.recipes$ = this.edamamService.searchRecipes(query).pipe(
        catchError((error) => {
          console.error("Ошибка при получении рецептов:", error);
          return of({ hits: [] });
        }),
        // map((data) => data.hits.map((hit: any) => hit.recipe))
        map((data) =>
          data.hits.map((hit: any) => ({
            uri: hit.recipe.uri,
            label: hit.recipe.label,
            image: hit.recipe.image,
            calories: hit.recipe.calories,
            yield: hit.recipe.yield,
            fat: hit.recipe.digest[0]?.total || 0,
            carbs: hit.recipe.digest[1]?.total || 0,
            protein: hit.recipe.digest[2]?.total || 0,
          }))
        )
      );
    }
  }

  openRecipeDetail(recipeUri: string) {
    const recipeId = encodeURIComponent(recipeUri);
    this.router.navigate(["/recipe", recipeId]);
  }
}
