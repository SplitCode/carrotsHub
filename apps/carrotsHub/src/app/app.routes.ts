import type { Route } from "@angular/router";
import { AuthGuard } from "@angular/fire/auth-guard";
import { HomeComponent } from "./home/home.component";
import { PageRoutes } from "./shared/constants/app.routes-path";
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
    loadComponent: () =>
      import("./auth/pages/login-page/login-page.component").then(
        (m) => m.LoginPageComponent
      ),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectLoggedInToHome },
  },
  {
    path: PageRoutes.Register,
    loadComponent: () =>
      import("./auth/pages/register-page/register-page.component").then(
        (m) => m.RegisterPageComponent
      ),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectLoggedInToHome },
  },
  {
    path: PageRoutes.Recipes,
    loadComponent: () =>
      import("./recipes/pages/recipes-page.component").then(
        (m) => m.RecipesPageComponent
      ),
  },
  {
    path: "recipes/:id",
    loadComponent: () =>
      import("./recipes/pages/recipe-detail/recipe-detail.component").then(
        (m) => m.RecipeDetailComponent
      ),
  },
  {
    path: PageRoutes.Profile,
    loadComponent: () =>
      import("./profile/profile-page.component").then(
        (m) => m.ProfilePageComponent
      ),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: PageRoutes.Journal,
    loadComponent: () =>
      import("./journal/pages/journal-page.component").then(
        (m) => m.JournalPageComponent
      ),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: PageRoutes.NotFound,
    loadComponent: () =>
      import("./core/pages/not-found-page.component").then(
        (m) => m.NotFoundPageComponent
      ),
  },
];
