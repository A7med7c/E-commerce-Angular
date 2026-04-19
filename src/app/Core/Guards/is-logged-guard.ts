import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const isLoggedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  return localStorage.getItem('token') !== null
    ? router.createUrlTree(['/home'])  
    : true;                            
};