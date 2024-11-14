export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegistrationCredentials = LoginCredentials & {
  confirmPassword: string;
};

export type FirebaseError = {
  code: string;
  message: string;
};
