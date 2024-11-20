import type { FormControl } from "@angular/forms";

export interface MealItem {
  label: string;
  quantity: number;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

export interface Meal {
  type: string;
  totalCalories: number;
  searchControl: FormControl;
  searchResults: any[];
  items: MealItem[];
  isExpanded: boolean;
  isLoading: boolean;
}
