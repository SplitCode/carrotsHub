export interface Recipe {
  uri: string;
  label: string;
  image: string;
  calories: number;
  yield: number;
  fat: number;
  carbs: number;
  protein: number;
  // digest?: DigestDetail[];
}
