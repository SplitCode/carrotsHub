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
import { PageRoutes } from "../../app.routes-path";

export const authGuard: CanActivateFn = (
  _route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuth().pipe(
    map((isAuth) => {
      const url = state.url.slice(1);

      if (isAuth && (url === PageRoutes.Login || url === PageRoutes.Register)) {
        router.navigate([PageRoutes.Home]);
        return false;
      }
      if (!isAuth && url !== PageRoutes.Login && url !== PageRoutes.Register) {
        router.navigate([PageRoutes.Login]);
        return false;
      }
      return true;
    })
  );
};
