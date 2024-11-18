import type { Recipe } from "../../recipes/models/recipe.interface";
// import type { RecipeDetail } from "../../recipes/models/recipe-detail.interface";

export interface RecipeResponse {
  hits: Array<{
    recipe: Recipe;
  }>;
}

// export interface RecipeDetailResponse {
//   recipe: RecipeDetail;
// }
