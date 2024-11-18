export interface RecipeDetail {
  uri: string;
  label: string;
  image: string;
  calories: number;
  yield: number;
  fat: number;
  carbs: number;
  protein: number;
  cuisineType: string[];
  dietLabels: string[];
  ingridients: string[];
}
