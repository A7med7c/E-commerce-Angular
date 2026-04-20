import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../Environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly _httpClient = inject(HttpClient)

  getAllProducts(): Observable<any> {
    return this._httpClient.get(`${environment.baseUrl}/products`)
  }

  getProduct(id: string): Observable<any> {
    return this._httpClient.get(`${environment.baseUrl}/products/${id}`)
  }
}
