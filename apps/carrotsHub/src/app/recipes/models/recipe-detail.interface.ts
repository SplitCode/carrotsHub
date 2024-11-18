export interface RecipeDetail {
  uri: string;
  label: string;
  image: string;
  images?: Images;
  calories: number;
  yield: number;
  cuisineType: string[];
  dietLabels: string[];
  healthLabels: string[];
  ingredientLines: string[];
  digest: DigestDetail[];
}

export interface ImageDetail {
  url: string;
  width: number;
  height: number;
}

export interface Images {
  THUMBNAIL?: ImageDetail;
  SMALL?: ImageDetail;
  REGULAR?: ImageDetail;
  LARGE?: ImageDetail;
}

export interface DigestDetail {
  label: string;
  tag: string;
  // schemaOrgTag?: string;
  total: number;
  // hasRDI: boolean;
  // daily?: number;
  // unit: string;
  // sub?: DigestDetail[];
}
