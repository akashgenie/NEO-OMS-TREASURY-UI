import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class OmsDashboardService {
  baseUrl = environment.baseUrl;
  omsUrl = environment.omsUrl;

  constructor(private http: HttpClient) {}

  getArnValidData(arnCode: any): Observable<any> {
    return this.http.get<any>(`${this.omsUrl}validate-arn?arnCode=${arnCode}`);
  }
  getClientListData(data: any): Observable<any> {
    return this.http.post<any>(`${this.omsUrl}GetClientList`, data, {});
  }
  getBrokerListData(data: any): Observable<any> {
    return this.http.post<any>(`${this.omsUrl}GetBrokerList`, data, {});
  }

  getDashboardData(data: any): Observable<any> {
    return this.http.post<any>(`${this.omsUrl}GetCxoDashboardData`, data, {});
  }

  getCsoDashboardData(data: any): Observable<any> {
    return this.http.post<any>(`${this.omsUrl}GetCxoCommonDashboardData`, data, {});
  }

  getCsoDashboardExcelData(data: any) {
    const url = `${this.omsUrl}DownloadCxoCommonDashboardData`;

    return this.http.post(url, data, { responseType: 'blob' as 'json' }, );
  }

  postPaymentData(data: any): Observable<any> {
    return this.http.post<any>(`${this.omsUrl}PaymentCreateRequest`, data, {});
  }
  updateOrderStatus(data: any): Observable<any> {
    return this.http.post<any>(`${this.omsUrl}UpdateOrderStatusById`, data, {});
  }
  updateOrderStatusMultiple(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.omsUrl}UpdateOrderStatusByIdForMultipuleOrders`,
      data,
     {});
  }
  stockTransferData(data: any): Observable<any> {
    return this.http.post<any>(`${this.omsUrl}StockCreateRequest`, data, {});
  }
  getAllDropdown(): Observable<any> {
    return this.http.get<any>(`${this.omsUrl}GetEnumMaster`);
  }
  getSortingData(dashboardName: string, fieldName: string): Observable<any> {
    return this.http.get<any>(
      `${this.omsUrl}GetDropDownData/${dashboardName}/${fieldName}`,
    );
  }
  documentDetailsPost(data: any): Observable<any> {
    return this.http.post(`${this.omsUrl}uploadDocuments`, data, {});
  }
  PaymentdocumentDetailsPost(data: any): Observable<any> {
    return this.http.post(`${this.omsUrl}uploadDocumentsForPayment`, data, {});
  }
  updateAllstatus(data: any): Observable<any> {
    return this.http.post(`${this.omsUrl}UpdateAllStatus`, data, {});
  }

  getDocumentDet(Id: any): Observable<any> {
    return this.http.get<any>(
      `${this.omsUrl}getDocumentDetailsByInvId?Id=${Id}`,
    );
  }

  getDocument(data: any): Observable<any> {
    return this.http.post(`${this.omsUrl}getDocumentDetailsByInvId`, data, {});
  }
  getDocumentPayment(data: any): Observable<any> {
    return this.http.post(
      `${this.omsUrl}getDocumentDetailsForPayemntRecevied`,
      data,
     {});
  }

  downloadDoc(data: any): Observable<any> {
    return this.http.post(`${this.omsUrl}downloadDocument`, data, {
      responseType: 'blob',
    }, );
  }

  documentDetailsDelete(data: any): Observable<any> {
    return this.http.post(`${this.omsUrl}deleteDocumentById?id=${data}`, {});
  }

  deletePaymentData(id: any) {
    return this.http.post<any>(`${this.omsUrl}DeletePayment?id=${id}`, {});
  }

  deleteStockData(id: any) {
    return this.http.post<any>(`${this.omsUrl}DeleteStock?id=${id}`, {});
  }

  getCXODashboardCount(): Observable<any> {
    return this.http.get<any>(`${this.omsUrl}GetDashboardCount`);
  }

  getDashboardCount(): Observable<any> {
    return this.http.get<any>(`${this.omsUrl}GetOpsDashboardCount`);
  }

  getDashboardDelerCount(): Observable<any> {
    return this.http.get<any>(`${this.omsUrl}GetDealerDashboardCount`);
  }

  dealIdDataPost(orderData: any): Observable<any> {
    return this.http.post<any>(`${this.omsUrl}UpdateDealId`, orderData, {});
  }

  getAllProduct(): Observable<any> {
    return this.http.post<any>(`${this.omsUrl}GetOmsProductList`, {});
  }

  getCXOViewData(id: any, HolderRankId: any): Observable<any> {
    return this.http.post<any>(
      `${this.omsUrl}CxoOperationKraDetails/${id}/${HolderRankId}`,
      {},
     {});
  }

  getClientListPOA(data: any): Observable<any> {
    return this.http.post<any>(`${this.omsUrl}GetClientListPOA`, data, {});
  }

  getPaymentDataForPush(clientCode: any): Observable<any> {
    return this.http.get<any>(
      `${this.omsUrl}GetPaymentDataForPush/${clientCode}`,
    );
  }

  AddPaymentToWsQueue(data: any): Observable<any> {
    return this.http.post<any>(`${this.omsUrl}AddPaymentToWsQueue`, data, {});
  }
  getPaymentDataDropDown(type: string): Observable<any> {
    return this.http.get<any>(`${this.omsUrl}GetEnumMasterByType/${type}`);
  }
}
