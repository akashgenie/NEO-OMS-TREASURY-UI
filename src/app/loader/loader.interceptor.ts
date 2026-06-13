import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, finalize, tap } from 'rxjs';
import { LoaderService } from './loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private totalRequests = 0;

  constructor(private loadingService: LoaderService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (
      request.url.includes('/api/app/product/search-bar-for-products') ||
      request.url.includes('Stage/GetSingleJourneyIpvStatus') ||
      request.url.includes('Stage/GetSingleJourneyEsignPdfTypeStatus') ||
      request.url.includes('Stage/GetSingleJourneyEsignLinks')
    ) {
      return next.handle(request);
    }
    this.totalRequests++;
    this.loadingService.setLoading(true);
    return next.handle(request).pipe(
      finalize(() => {
        this.totalRequests--;

        if (this.totalRequests == 0) {
          this.loadingService.setLoading(false);
        }
      }),
    );
  }
}
