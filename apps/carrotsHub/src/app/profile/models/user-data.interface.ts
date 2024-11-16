export interface UserData {
  uid: string;
  name: string;
  email: string;
  createdAt: string;
  age?: number;
  weight?: number;
  targetWeight?: number;
  height?: number;
  gender: Gender;
  target: Target;
  lifestyle: Lifestyle;
}

type Gender = "male" | "female";

type Target = "Снижение веса" | "Поддержание веса" | "Набор веса";

type Lifestyle = "Сидячий" | "Малоактивный" | "Активный" | "Очень активный";
