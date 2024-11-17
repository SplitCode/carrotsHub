export enum GOAL {
  weightLoss = "Снижение веса",
  maintenance = "Поддержание веса",
  weightGain = "Набор веса",
}

export enum GENDER {
  male = "Мужской",
  female = "Женский",
}

export enum LIFESTYLE {
  sedentary = "Сидячий",
  lightActive = "Малоактивный",
  active = "Активный",
  veryActive = "Очень активный",
}

export const ACTIVITY_LEVELS: Record<LIFESTYLE, number> = {
  [LIFESTYLE.sedentary]: 1.2,
  [LIFESTYLE.lightActive]: 1.375,
  [LIFESTYLE.active]: 1.55,
  [LIFESTYLE.veryActive]: 1.725,
};
