export enum GOAL {
  weightLoss = "Lose weight",
  maintenance = "Maintain weight",
  weightGain = "Gain weight",
}

export enum GENDER {
  male = "Male",
  female = "Femle",
}

export enum LIFESTYLE {
  sedentary = "Sedentary",
  lightActive = "Light active",
  active = "Active",
  veryActive = "Very active",
}

export const ACTIVITY_LEVELS: Record<LIFESTYLE, number> = {
  [LIFESTYLE.sedentary]: 1.2,
  [LIFESTYLE.lightActive]: 1.375,
  [LIFESTYLE.active]: 1.55,
  [LIFESTYLE.veryActive]: 1.725,
};
