import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpClient,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { SharedService } from '../shared/service/shared.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    let token = this.sharedService.getSessionStorageData('personalInfo')?.token;

    let authReq = request;

    if (token != null) {
      const httpOptions = new HttpHeaders({
        Authorization: `${token}`,
      });

      authReq = request.clone({ headers: httpOptions });
    }

    return next.handle(authReq).pipe();
  }
}
