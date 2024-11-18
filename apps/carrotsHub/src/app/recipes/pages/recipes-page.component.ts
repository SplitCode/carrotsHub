import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
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
import { RecipeCardComponent } from "../components/recipe-card/recipe-card.component";
import type { RecipeResponse } from "../../api/models/edamam.interface";

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
    RecipeCardComponent,
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
  isSearched = false;

  private readonly edamamService = inject(EdamamService);

  onSearch() {
    const query = this.searchForm.get("searchControl")?.value;

    if (query?.trim()) {
      this.isSearched = true;
      this.recipes$ = this.edamamService.searchRecipes(query).pipe(
        map((data: RecipeResponse) =>
          data.hits.map((hit) => ({
            ...hit.recipe,
            uri: hit.recipe.uri,
            label: hit.recipe.label,
            image: hit.recipe.image,
            calories: hit.recipe.calories,
            yield: hit.recipe.yield,
            fat: hit.recipe.digest[0]?.total || 0,
            carbs: hit.recipe.digest[1]?.total || 0,
            protein: hit.recipe.digest[2]?.total || 0,
          }))
        ),
        catchError((error) => {
          console.error("Ошибка при получении рецептов:", error);
          this.isSearched = true;
          return of([]);
        })
      );
    } else {
      this.isSearched = false;
      this.recipes$ = of([]);
    }
  }
}
