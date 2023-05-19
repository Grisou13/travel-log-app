import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { AuthService } from '../services/auth-service.service';

export const authGuard = () => {
  const router = inject(Router);
  const service = inject(AuthService);
  return service.IsAuthenticated$.pipe(
    map((isAuthenticated) => {
      return !isAuthenticated ? router.navigate(['/login']) : true;
    })
  );
};
