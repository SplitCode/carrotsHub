import type { Recipe } from "./recipe.interface";

export interface RecipeDetail extends Recipe {
  images: Images;
  cuisineType: string[];
  dietLabels: string[];
  healthLabels: string[];
  ingredientLines: string[];
  digest: DigestDetail[];
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

export interface DigestDetail {
  label: string;
  tag: string;
  total: number;
}
