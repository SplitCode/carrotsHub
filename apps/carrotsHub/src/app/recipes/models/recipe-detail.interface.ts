import type { Recipe } from "./recipe.interface";

export interface RecipeDetail extends Recipe {
  images: Images;
  cuisineType: string[];
  dietLabels: string[];
  healthLabels: string[];
  ingredientLines: string[];
}

export interface ImageDetail {
  url: string;
  width: number;
  height: number;
}

export interface Images {
  THUMBNAIL?: ImageDetail;
  SMALL?: ImageDetail;
  REGULAR?: ImageDetail;
  LARGE?: ImageDetail;
}
