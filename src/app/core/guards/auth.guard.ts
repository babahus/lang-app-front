import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";


export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  const auth = inject(AuthService);

  return auth.isAuthenticate;
}
