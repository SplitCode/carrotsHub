import { Router } from "@angular/router";
import type {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from "@angular/router";
import { inject } from "@angular/core";
import type { Observable } from "rxjs";
import { map } from "rxjs";
import { AuthService } from "../services/auth.service";

export const authGuard: CanActivateFn = (
  _route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuth().pipe(
    map((isAuth) => {
      const { url } = state;

      if (isAuth && (url === "/login" || url === "/register")) {
        router.navigate([""]);
        return false;
      }
      if (!isAuth && url !== "/login" && url !== "/register") {
        router.navigate(["/login"]);
        return false;
      }
      return true;
    })
  );
};
