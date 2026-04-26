import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../Environments/environment';
import { StorageService } from './storage-serive';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  private readonly _httpClient = inject(HttpClient);
  private readonly _storageService = inject(StorageService);



  addToCart(id: string): Observable<any> {
    return this._httpClient.post(
      `${environment.baseUrl}/cart`,
      { productId: id });
  }

  getitems(): Observable<any> {
    return this._httpClient.get(`${environment.baseUrl}/cart`)
  }

  deleteItem(id: string): Observable<any> {
    return this._httpClient.delete(`${environment.baseUrl}/cart/${id}`)
  }

  changeCount(id: string, itemCount: number): Observable<any> {
    return this._httpClient.put(`${environment.baseUrl}/cart/${id}`,
      {
        "count": itemCount
      })
  }

  clearCart(): Observable<any> {
    return this._httpClient.delete(`${environment.baseUrl}/cart`)
  }
}