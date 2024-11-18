import type { GENDER } from "../constants/profile";
import type { GOAL, LIFESTYLE } from "../constants/profile";

export interface UserData {
  uid: string;
  name: string;
  email: string;
  createdAt: string;
  age?: number;
  weight?: number;
  optimalWeight?: number;
  height?: number;
  gender?: GENDER;
  goal?: GOAL;
  lifestyle?: LIFESTYLE;
  calculatedCalories?: number;
  protein?: number;
  fat?: number;
  carbohydrates?: number;
}