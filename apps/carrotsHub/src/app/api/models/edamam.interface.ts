import type { Recipe } from "../../recipes/models/recipe.interface";

export interface EdamamResponse {
  hits: Array<{
    recipe: Recipe;
  }>;
}
