import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class BrokerUnlistedService {
  omsUrl = environment.omsUrl;

  constructor(private http: HttpClient) {}

  getPlaceOrderViewData(clientCode: any): Observable<any> {
    return this.http.post<any>(
      `${this.omsUrl}KRADetailsByClientCode?clientCode=${clientCode}`,
      {},
     );
  }
  getBankDet(brokerCode: any): Observable<any> {
    return this.http.get<any>(
      `${this.omsUrl}GetBrokerMultipleAccountNo?brokerCode=${brokerCode}`,
      {},
    );
  }
  postBankAccountno(bankAccountno: any): Observable<any> {
    return this.http.get<any>(
      `${this.omsUrl}GetBrokerAccountDetails?bankAccountno=${bankAccountno}`,
      {},
    );
  }
  getPlaceOrderData(data: any): Observable<any> {
    return this.http.post<any>(`${this.omsUrl}GetBrokerDetails`, data, {});
  }
  getDpData(brokerCode: any): Observable<any> {
    return this.http.get<any>(
      `${this.omsUrl}GetBrokerMultipleDematNo?brokerCode=${brokerCode}`,
      {},
    );
  }
  postDpId(
    id: any,
    BankId: any,
    InvId: any,
    HolderRankId: any,
  ): Observable<any> {
    return this.http.post<any>(
      `${this.omsUrl}GetClientDetailsPlaceOrdeByDpId/${id}/${BankId}/${InvId}/${HolderRankId}`,
      {},
     {});
  }

  getcustomTebleData(orderType: any): Observable<any> {
    return this.http.get<any>(
      `${this.omsUrl}GetHoldingMasterDataList?orderType=${orderType}`,
    );
  }
  getUnlistedQuantity(data: any) {
    return this.http.post<any>(
      `${this.omsUrl}RecalculateQuantitiesForAllocation`,
      data,
     {});
  }
  getFloorPrice(data: any) {
    return this.http.post<any>(`${this.omsUrl}GetFloorPrice`, data, {});
  }

  getLobData(isonCode: any, entityId: any): Observable<any> {
    const params = new HttpParams()
      .set('isonCode', isonCode)
      .set('entityId', entityId);

    return this.http.get<any>(`${this.omsUrl}getLobMaster`, { params });
  }
  postOrderType(data: any) {
    return this.http.post<any>(`${this.omsUrl}AddViewCartDataMFNO`, data, {});
  }
  getViewCartData(brokerId: any): Observable<any> {
    return this.http.post<any>(
      `${this.omsUrl}ViewNormalMFOrders?brokerId=${brokerId}`,
      {},
     {});
  }
  deleteViewCartData(requestPayload: any) {
    return this.http.post<any>(
      `${this.omsUrl}DeleteViewCartData`,
      requestPayload,
     {});
  }

  postOrderData(orderData: any): Observable<any> {
    return this.http.post<any>(
      `${this.omsUrl}OMSOrder/process-orders`,
      orderData,
     {});
  }
}
