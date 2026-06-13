import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { EncryptionWrapperService } from '../encryption/encryption-wrapper.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.baseUrl;
  omsUrl = environment.omsUrl;

  constructor(
    private http: HttpClient,
    private encryptionService: EncryptionWrapperService,
  ) {}

  logIn(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}Authentication/generateOTP`,
      data,
     {});
  }

  CheckUserLogIn(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}Authentication/checkUser`,
      data,
      { observe: 'response' },
     );
  }

  checkUserLogin(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}Authentication/checkUser`, data, {});
  }

  samlLogin(email: string): void {
    const base64Email = btoa(email);
    const encodedEmail = encodeURIComponent(base64Email);

    const { headers } = this.encryptionService.prepareHeaders();

    const loginUrl = `${this.baseUrl}Authentication/login?email=${encodedEmail}&X-UserId=${encodeURIComponent(headers['X-UserId'])}&X-RequestId=${encodeURIComponent(headers['X-RequestId'])}&X-Password=${encodeURIComponent(headers['X-Password'])}`;

    window.location.href = loginUrl;
  }

  otpVerification(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}Authentication/verifyOTP`, data, {});
  }

  verifyAzureToken(token: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}Authentication/verifyToken`, {
      token: token,
    }, {});
  }

  logOut(token: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}Authentication/logout?token=${token}`,
     {});
  }

  getRoleAccess(token: string): Observable<any> {
    return this.http.post<any>(
      `${this.omsUrl}Role/RoleManagmentDataForMultipleRole?token=${token}`,
      '',
     {});
  }
}
