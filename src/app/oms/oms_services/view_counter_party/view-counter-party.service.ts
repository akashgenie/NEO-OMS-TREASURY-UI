import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ViewCounterPartyService {
  omsUrl = environment.omsUrl;
  constructor(private http: HttpClient) {}

  getIViewCounterDashData(data: any): Observable<any> {
    return this.http.post<any>(`${this.omsUrl}GetBrokerDashBoardData`, data, {});
  }
  getViewCounterDashboardExcelData(data: any) {
    const url = `${this.omsUrl}DownloadBrokerData`;

    return this.http.post(url, data, { responseType: 'blob' as 'json' }  );
  }

  getDocument(brokerId: any): Observable<any> {
    const params = new HttpParams().set('brokerId', brokerId);
    return this.http.get<any>(`${this.omsUrl}GetBrokerDocumentsByBrokerId`, {
      params,
    });
  }
  documentDetailsPost(data: any): Observable<any> {
    return this.http.post(`${this.omsUrl}SaveBrokerDocuments`, data, {});
  }
}
