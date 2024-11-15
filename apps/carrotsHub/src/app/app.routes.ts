import type { Route } from "@angular/router";
import { AuthGuard } from "@angular/fire/auth-guard";
import { HomeComponent } from "./home/home.component";
import { LoginPageComponent } from "./auth/pages/login-page/login-page.component";
import { RegisterPageComponent } from "./auth/pages/register-page/register-page.component";
import { ReceipePageComponent } from "./receipe/pages/receipe-page.component";
import { ProfilePageComponent } from "./profile/profile-page.component";
import { JournalPageComponent } from "./journal/pages/journal-page.component";
// import { Page404Component } from "./core/pages/page404/page404.component";
import { PageRoutes } from "./app.routes-path";
import {
  redirectUnauthorizedToLogin,
  redirectLoggedInToHome,
} from "./auth/guards/auth.guard";

export const appRoutes: Route[] = [
  {
    path: PageRoutes.Home,
    component: HomeComponent,
  },
  {
    path: PageRoutes.Login,
    component: LoginPageComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectLoggedInToHome },
  },
  {
    path: PageRoutes.Register,
    component: RegisterPageComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectLoggedInToHome },
  },
  {
    path: PageRoutes.Recipes,
    component: ReceipePageComponent,
  },
  {
    path: PageRoutes.Profile,
    component: ProfilePageComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: PageRoutes.Journal,
    component: JournalPageComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  // {
  //   path: PageRoutes.NotFound,
  //   component: Page404Component,
  // },
];
