import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../Environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly _httpClient = inject(HttpClient)

  getAllCategories(): Observable<any> {
    return this._httpClient.get(`${environment.baseUrl}/categories`);
  }

  getCategory(id: string): Observable<any> {
    return this._httpClient.get(`${environment.baseUrl}/categories/${id}`);
  }
}
