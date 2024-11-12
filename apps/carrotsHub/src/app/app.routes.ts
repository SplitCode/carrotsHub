import type { Route } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { LoginPageComponent } from "./auth/pages/login-page/login-page.component";
import { RegisterPageComponent } from "./auth/pages/register-page/register-page.component";

export const appRoutes: Route[] = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "login",
    component: LoginPageComponent,
  },
  {
    path: "register",
    component: RegisterPageComponent,
  },
  // {
  //   path: "**",
  //   component: NotFoundPageComponent,
  // },
];
