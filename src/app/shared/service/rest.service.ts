import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';

const httpOptions = {
  headers: new HttpHeaders({}),
};

@Injectable({
  providedIn: 'root',
})
export class RestService {
  private apiendpoint_uat: string =
    'https://console.theneoworld.com/oms-pms/api/';

  getapiendpoint() {
    return this.apiendpoint_uat;
  }

  constructor(private http: HttpClient) {}
  getAll(endpoint: string): Observable<any> {
    return this.http.get(endpoint).pipe(catchError(this.handleError()));
  }

  getById(endpoint: string, Id: string): Observable<any> {
    return this.http.get(endpoint + Id).pipe(catchError(this.handleError()));
  }

  create(endpoint: string, model: any): Observable<any> {
    return this.http
      .post(endpoint, model, httpOptions)
      .pipe(catchError(this.handleError()));
  }

  postParams(endpoint: string, params: any): Observable<any> {
    return this.http
      .post(endpoint, params, httpOptions)
      .pipe(catchError(this.handleError()));
  }

  checkDuplicate(endpoint: string, Value: string, Id: string): Observable<any> {
    return this.http
      .get(endpoint + Value + '/' + Id)
      .pipe(catchError(this.handleError()));
  }

  checkDuplicateParam(endpoint: string, Value: string): Observable<any> {
    return this.http.get(endpoint + Value).pipe(catchError(this.handleError()));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

  encryptionAES(code: any) {
    var ciphertext = CryptoJS.AES.encrypt(code, 'newel');
    return ciphertext.toString();
  }

  decrypt(value: any) {
    const bytes = CryptoJS.AES.decrypt(value, 'newel');
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
  }
}
