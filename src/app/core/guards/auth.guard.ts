import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticate) {
    return true;
  }

  router.navigate(['login'])

  return false;
}
