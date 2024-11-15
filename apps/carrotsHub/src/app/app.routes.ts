import type { Route } from "@angular/router";
import { AuthGuard } from "@angular/fire/auth-guard";
import { HomeComponent } from "./home/home.component";
import { LoginPageComponent } from "./auth/pages/login-page/login-page.component";
import { RegisterPageComponent } from "./auth/pages/register-page/register-page.component";
import { RecipesPageComponent } from "./recipes/pages/recipes-page.component";
import { ProfilePageComponent } from "./profile/profile-page.component";
import { JournalPageComponent } from "./journal/pages/journal-page.component";
import { NotFoundPageComponent } from "./core/pages/not-found-page.component";
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
    component: RecipesPageComponent,
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
  {
    path: PageRoutes.NotFound,
    component: NotFoundPageComponent,
  },
];
