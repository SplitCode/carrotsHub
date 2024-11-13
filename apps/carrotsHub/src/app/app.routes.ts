import type { Route } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { LoginPageComponent } from "./auth/pages/login-page/login-page.component";
import { RegisterPageComponent } from "./auth/pages/register-page/register-page.component";
import { PageRoutes } from "./app.routes-path";
import { authGuard } from "./auth/guards/auth.guard";

export const appRoutes: Route[] = [
  {
    path: PageRoutes.Home,
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: PageRoutes.Login,
    component: LoginPageComponent,
    canActivate: [authGuard],
  },
  {
    path: PageRoutes.Register,
    component: RegisterPageComponent,
    canActivate: [authGuard],
  },
  // {
  //   path: "**",
  //   component: NotFoundPageComponent,
  // },
];
