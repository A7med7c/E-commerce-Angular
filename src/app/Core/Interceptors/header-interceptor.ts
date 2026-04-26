import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../Services/storage-serive';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {


  const _storageService = inject(StorageService);
  const token = _storageService.getToken();
  const protectedRoutes = ['/cart', '/wishlist', '/orders'];
  const isProtected = protectedRoutes.some(route => req.url.includes(route));

  if (token && isProtected) {
    req = req.clone({
      headers: req.headers.set('token', token)
    })

  }
  return next(req);
};
