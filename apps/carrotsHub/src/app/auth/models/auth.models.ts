export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegistrationCredentials = LoginCredentials & {
  confirmPassword: string;
};
