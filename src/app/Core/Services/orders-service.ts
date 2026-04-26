import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../Environments/environment';
import { StorageService } from './storage-serive';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _storageService = inject(StorageService);

  private readonly Headers: any = {
    token: this._storageService.getToken() ?? ''
  }

  checkout(cartid: string | null, shippingDetails: object): Observable<any> {
    return this._httpClient.post(`${environment.baseUrl}/orders/checkout-session/${cartid}?url=${environment.frontUrl}`, {
      "shippingAddress": shippingDetails
    },
      {
        headers: this.Headers
      }
    )
  }
}
