import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../Environments/environment';
import { StorageService } from './storage-serive';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _storageService = inject(StorageService);
  userData: any = null;

  checkout(cartid: string | null, shippingDetails: object): Observable<any> {
    return this._httpClient.post(`${environment.baseUrl}/orders/checkout-session/${cartid}?url=${environment.frontUrl}`, {
      "shippingAddress": shippingDetails
    })
  }

  getUserOrders(): Observable<any> {
    let token = this._storageService.getToken()
    if (token) {
      this.userData = jwtDecode(token)
    }
    return this._httpClient.get(`${environment.baseUrl}/orders/user/${this.userData.id}`);
  }
}
