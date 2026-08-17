import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const allowedRoles = route.data['roles'] as UserRole[];
  const currentRole = authService.getCurrentRole();

  if (currentRole && allowedRoles && allowedRoles.includes(currentRole)) {
    return true;
  }

  return router.createUrlTree(['/unauthorized']);
};
