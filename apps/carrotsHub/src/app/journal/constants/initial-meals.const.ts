import { FormControl } from "@angular/forms";
import type { Meal } from "../models/meals.interface";

export const initialMeals: Meal[] = [
  {
    type: "Breakfast",
    totalCalories: 0,
    searchControl: new FormControl(""),
    searchResults: [],
    items: [],
    isExpanded: false,
    isLoading: false,
  },
  {
    type: "Lunch",
    totalCalories: 0,
    searchControl: new FormControl(""),
    searchResults: [],
    items: [],
    isExpanded: false,
    isLoading: false,
  },
  {
    type: "Dinner",
    totalCalories: 0,
    searchControl: new FormControl(""),
    searchResults: [],
    items: [],
    isExpanded: false,
    isLoading: false,
  },
  {
    type: "Snack",
    totalCalories: 0,
    searchControl: new FormControl(""),
    searchResults: [],
    items: [],
    isExpanded: false,
    isLoading: false,
  },
];
