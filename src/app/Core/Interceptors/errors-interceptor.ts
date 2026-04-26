import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';
import { catchError, throwError } from 'rxjs';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {

  const toastr = inject(ToastrService);
  const platformId = inject(PLATFORM_ID);

  return next(req).pipe(

    catchError((err: HttpErrorResponse) => {

      let message = 'Something went wrong';

      if (err.status === 0) {
        message = 'Network error, please check your connection';
      }

      else if (err.error) {

        if (typeof err.error === 'string') {
          message = err.error;
        }

        else if (err.error.message) {
          message = err.error.message;
        }

        else if (err.error.errors && Array.isArray(err.error.errors)) {
          message = err.error.errors.map((e: any) => e.msg).join(', ');
        }

        else if (err.error.statusMsg) {
          message = err.error.statusMsg;
        }
      }

      else {
        switch (err.status) {
          case 401:
            message = 'Unauthorized, please login again';
            break;

          case 404:
            message = 'Resource not found';
            break;

          case 500:
            message = 'Server error, try again later';
            break;
        }
      }

      if (isPlatformBrowser(platformId)) {
        toastr.error(message, 'Error');
      }

      return throwError(() => err);
    })
  );
};