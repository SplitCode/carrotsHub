import { FormControl } from "@angular/forms";
import type { Meal } from "../models/meals.interface";

export const initialMeals: Meal[] = [
  {
    type: "Завтрак",
    totalCalories: 0,
    searchControl: new FormControl(""),
    searchResults: [],
    items: [],
    isExpanded: false,
  },
  {
    type: "Обед",
    totalCalories: 0,
    searchControl: new FormControl(""),
    searchResults: [],
    items: [],
    isExpanded: false,
  },
  {
    type: "Ужин",
    totalCalories: 0,
    searchControl: new FormControl(""),
    searchResults: [],
    items: [],
    isExpanded: false,
  },
  {
    type: "Перекус",
    totalCalories: 0,
    searchControl: new FormControl(""),
    searchResults: [],
    items: [],
    isExpanded: false,
  },
];
