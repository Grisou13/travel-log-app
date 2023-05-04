
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {tap} from 'rxjs';
import {AuthService} from '../services/auth-service.service';

export const authGuard = () => {
    const router = inject(Router);
    const service = inject(AuthService)
    return service.isAuthenticated();
}

