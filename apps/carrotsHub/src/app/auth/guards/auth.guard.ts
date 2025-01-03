import {
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from "@angular/fire/auth-guard";
import { PageRoutes } from "../../shared/constants/app.routes-path";

export const redirectUnauthorizedToLogin = () =>
  redirectUnauthorizedTo([PageRoutes.Login]);

export const redirectLoggedInToHome = () =>
  redirectLoggedInTo([PageRoutes.Home]);
