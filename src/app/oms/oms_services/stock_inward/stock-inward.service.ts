import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class StockInwardService {
  omsUrl = environment.omsUrl;
  constructor(private http: HttpClient) {}
  getcustomTebleData(orderType: any): Observable<any> {
    return this.http.get<any>(
      `${this.omsUrl}GetHoldingMasterDataList?orderType=${orderType}`,
    );
  }
  getBuyingEntity(): Observable<any> {
    return this.http.get<any>(`${this.omsUrl}getomsentity`);
  }
  getBuyingEntityBuy(data: any): Observable<any> {
    return this.http.post<any>(`${this.omsUrl}GetAllocatedEntity`, data, {});
  }

  getBuyingEntityData(entityId: any): Observable<any> {
    return this.http.get<any>(`${this.omsUrl}getomsentitybanks/${entityId}`);
  }
  getBuyingDematEntityData(entityId: any): Observable<any> {
    return this.http.get<any>(`${this.omsUrl}getomsentitydemats/${entityId}`);
  }
  getSellingEntity(): Observable<any> {
    return this.http.get<any>(`${this.omsUrl}GetBrokerList`);
  }
  getSellingDownsellEntity(ISINCode: any): Observable<any> {
    return this.http.get<any>(
      `${this.omsUrl}GetDownsellBrokerList/${ISINCode}`,
    );
  }
  getBrokerData(Isin: any, brokerId: any): Observable<any> {
    const params = new HttpParams().set('Isin', Isin).set('brokerId', brokerId);

    return this.http.get<any>(`${this.omsUrl}GetBlockOrderList`, { params });
  }
  getSellingEntityData(entityId: any): Observable<any> {
    return this.http.get<any>(`${this.omsUrl}getBrokerbanks/${entityId}`);
  }
  getSellingDemateEntityData(entityId: any): Observable<any> {
    return this.http.get<any>(`${this.omsUrl}getBrokerdemats/${entityId}`);
  }
  saveStock(data: any): Observable<any> {
    return this.http.post(`${this.omsUrl}StockInward`, data, {});
  }

  submitStock(data: any): Observable<any> {
    return this.http.post(`${this.omsUrl}StockInward`, data, {});
  }

  getInwardEditData(id: any): Observable<any> {
    return this.http.get<any>(`${this.omsUrl}GetStockInwardById/${id}`);
  }

  getDemateDropDown(): Observable<any> {
    return this.http.get<any>(`${this.omsUrl}getomsentitydematList`);
  }
  getBankDropDown(): Observable<any> {
    return this.http.get<any>(`${this.omsUrl}getomsentitybanksList`);
  }

  getApproverList(): Observable<any> {
    return this.http.get<any>(`${this.omsUrl}GetApproverList`);
  }
}
