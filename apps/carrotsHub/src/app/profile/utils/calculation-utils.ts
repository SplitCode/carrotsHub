import { GENDER, GOAL } from "../constants/profile";

export function calculateBaseMetabolicRate(
  weight: number,
  height: number,
  age: number,
  gender: GENDER
): number {
  if (gender === GENDER.male) {
    return 9.99 * weight + 6.25 * height - 4.92 * age + 5;
  }
  return 9.99 * weight + 6.25 * height - 4.92 * age - 161;
}

export function calculateCalories(goal: GOAL, normRSK: number): number {
  switch (goal) {
    case GOAL.weightLoss:
      return Math.round(normRSK - normRSK * 0.2);
    case GOAL.weightGain:
      return Math.round(normRSK + normRSK * 0.2);
    case GOAL.maintenance:
    default:
      return normRSK;
  }
}

export function calculateOptimalWeightByBrock(
  height: number,
  gender: GENDER
): number {
  return gender === GENDER.male
    ? Math.round((height - 100) * 1.15)
    : Math.round((height - 110) * 1.15);
}
