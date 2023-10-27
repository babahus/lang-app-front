import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {inject} from "@angular/core";
import {ProfileService} from "../services/profile-service.service";
import {map} from "rxjs";

export const roleGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const requiredRole = next.data['requiredRole'];
  const profile = inject(ProfileService);
  const router = inject(Router);

  return profile.getCurrentUserRole().pipe(
      map((userRole: string | undefined) => {
        if (userRole === requiredRole) {
          return true;
        } else {
          router.navigate(['/']);
          return false;
        }
      })
  );
};