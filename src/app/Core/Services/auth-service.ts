import { environment } from './../Environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {


  private readonly _httpClient = inject(HttpClient)
  private readonly _router = inject(Router)

  userData: any = null;

  register(data: object): Observable<any> {
    return this._httpClient.post(`${environment.baseUrl}/signup`, data);
  }

  login(data: object): Observable<any> {
    return this._httpClient.post(`${environment.baseUrl}/signin`, data);
  }

  saveUserDate(): void {
    if (localStorage.getItem('token') !== null) {
      this.userData = jwtDecode(localStorage.getItem('token')!)
    }
  }

  logOut(): void {
    localStorage.removeItem('token');
    this.userData = null;
    // if there is endpoint in backend that remove token call it 
    this._router.navigate(['/login']);
  }
}