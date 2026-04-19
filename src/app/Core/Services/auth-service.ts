import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private baseUrl = 'https://ecommerce.routemisr.com/api/v1/auth';
  private readonly _httpClient = inject(HttpClient)

  register(data: object): Observable<any> {
    return this._httpClient.post(`${this.baseUrl}/signup`, data);
  }
}