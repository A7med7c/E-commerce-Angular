import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../Environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  private readonly _httpClient = inject(HttpClient);

  itemsNumber: WritableSignal<number> = signal(0);


  addToCart(id: string): Observable<any> {
    return this._httpClient.post(
      `${environment.baseUrl}/cart`,
      { productId: id });
  }

  getitems(): Observable<any> {
    return this._httpClient.get(`${environment.baseUrl}/cart`)
  }

  refreshItemsCount(): void {
    this.getitems().subscribe({
      next: (res) => this.itemsNumber.set(res.numOfCartItems ?? 0),
      error: () => this.itemsNumber.set(0),
    });
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