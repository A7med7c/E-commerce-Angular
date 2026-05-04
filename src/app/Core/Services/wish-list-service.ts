import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../Environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WishListService {
  private readonly _httpClient = inject(HttpClient)

  addToWishList(productId: string): Observable<any> {
    return this._httpClient.post(`${environment.baseUrl}/wishlist`, {
      "productId": productId
    })
  }
  removeFromWishlist(productId: string): Observable<any> {
    return this._httpClient.delete(`${environment.baseUrl}/wishlist/${productId}`)
  }
  
  getUserWishList(): Observable<any> {
    return this._httpClient.get(`${environment.baseUrl}/wishlist`)
  }
}
