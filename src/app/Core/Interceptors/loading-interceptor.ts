import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

let requestCount = 0;
let timer: any;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

  const spinner = inject(NgxSpinnerService);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {

    requestCount++;

    if (requestCount === 1) {
      spinner.show('loading-3');
    }
  }

  return next(req).pipe(
    finalize(() => {

      if (isPlatformBrowser(platformId)) {

        requestCount--;

        if (requestCount < 0) requestCount = 0;

        if (requestCount === 0) {

          clearTimeout(timer);
          timer = setTimeout(() => {
            spinner.hide('loading-3');
          }, 200); 
        }
      }
    })
  );
};