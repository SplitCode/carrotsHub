import type { Recipe } from "../../recipes/models/recipe.interface";

export interface RecipeResponse {
  hits: Array<{
    recipe: Recipe;
  }>;
}
