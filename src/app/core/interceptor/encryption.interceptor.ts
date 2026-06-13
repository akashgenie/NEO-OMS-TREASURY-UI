import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, map, of, switchMap } from 'rxjs';
import { EncryptionWrapperService } from 'src/app/service/encryption/encryption-wrapper.service';
import { APP_CONSTANTS } from 'src/app/app-constants';
import { environment } from 'src/environments/environment.development';

@Injectable()
export class EncryptionInterceptor implements HttpInterceptor {
  baseUrl = environment.baseUrl;

  isEncryptionDecryption = atob(APP_CONSTANTS.IS_RSA_ENCRYPTION_DECRYPTION);

  constructor(private encryption: EncryptionWrapperService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const url = req.url;

    if (this.isEncryptionDecryption == 'false') {
      return next.handle(req);
    }

    const skipUrls = [
      'GetMeargePDF',
      'ThirdParty/downloadDocument',
      'Authentication/login',
    ];
    const shouldSkip = skipUrls.some((pattern) => url.includes(pattern));
    if (shouldSkip) {
      return next.handle(req);
    }

    if (!url.startsWith(this.baseUrl)) {
      return next.handle(req);
    }

    const isBodyPresent =
      req.body != null &&
      req.body != undefined &&
      !(req.body instanceof FormData) &&
      !(typeof req.body == 'string');

    let modifiedReq = req;

    if (isBodyPresent) {
      const { encryptedBody, headers } = this.encryption.prepareRequest(
        req.body,
      );

      modifiedReq = req.clone({
        body: encryptedBody,
        setHeaders: headers,
      });
    } else {
      const dummyData = {};

      const { encryptedBody, headers } =
        this.encryption.prepareRequest(dummyData);

      modifiedReq = req.clone({
        body: null,
        setHeaders: headers,
      });
    }

    return next.handle(modifiedReq).pipe(
      switchMap((event) => {
        if (event instanceof HttpResponse) {
          if (event.body instanceof Blob) {
            const reader = new FileReader();

            return new Observable<HttpEvent<any>>((observer) => {
              reader.onloadend = () => {
                const encryptedText = reader.result as string;

                const decryptedObj =
                  this.encryption.decryptBlobObj(encryptedText);

                const mimeType = 'text/plain';

                const finalBlob = this.encryption.wordArrayToBlob(decryptedObj);
                const modifiedResponse = event.clone({ body: finalBlob });
                observer.next(modifiedResponse);
                observer.complete();
              };

              reader.readAsText(event.body);
            });
          }

          if (typeof event.body == 'string') {
            const decrypted = this.encryption.decryptResponseObj(event.body);
            return of(event.clone({ body: decrypted }));
          }
        }

        return of(event);
      }),
    );
  }
}
