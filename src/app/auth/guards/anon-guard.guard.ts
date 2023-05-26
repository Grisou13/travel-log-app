import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { map, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth-service.service';

export const anonGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const isAuthenticated = authService.isTokenValid();
  if (!isAuthenticated) {
    return true;
  }
  router.navigate(['/app']);
  return false;
  /*
  return authService.IsAuthenticated$.pipe(
    switchMap((isAuthenticated) => {
      if (!isAuthenticated) {
        return of(true);
      }
      return of(router.navigate(['/app'])).pipe(map((_) => false));
      // return false;
    })
  );*/
};
