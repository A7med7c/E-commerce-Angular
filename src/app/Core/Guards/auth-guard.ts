import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../Services/storage-serive';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const _storageService = inject(StorageService);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  return _storageService.getToken() !== null
    ? true
    : router.createUrlTree(['/login']);
};