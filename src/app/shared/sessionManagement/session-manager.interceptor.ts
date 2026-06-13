import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';
import { SharedService } from '../service/shared.service';

@Injectable()
export class SessionManagerInterceptor implements HttpInterceptor {
  logoutCalled = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private sharedService: SharedService,
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error?.status === 401) {
          const token =
            this.sharedService.getSessionStorageData('personalInfo')?.token;

          if (token && !this.logoutCalled) {
            this.logoutCalled = true;
            this.authService.logOut(token).subscribe(
              (res) => {
                localStorage.clear();
                sessionStorage.clear();

                this.router.navigate(['']);
              },
              (error) => {
                localStorage.clear();
                sessionStorage.clear();
                this.router.navigate(['']);
              },
            );
          } else {
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigate(['']);
          }
        }
        return throwError(() => error);
      }),
    );
  }
}
