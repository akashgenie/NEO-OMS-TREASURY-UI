import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PlaceOrderService {
  baseUrl = environment.baseUrl;
  url = 'https://localhost:7122/common/api/';
  omsUrl = environment.omsUrl;

  constructor(private http: HttpClient) {}

  getPlaceOrderData(clientCode: any): Observable<any> {
    return this.http.post<any>(
      `${this.omsUrl}GetClientDetailsPlaceOrdeByClientCode?clientCode=${clientCode}`,
      {},
     {});
  }

  getClientDetails(
    clientCode: any,
    bankAccountNo: any,
    dpClientId: any,
  ): Observable<any> {
    return this.http.post<any>(
      `${this.omsUrl}GetClientDetailsPlaceOrderByClientCodeAndBankAccount?clientCode=${clientCode}&bankAccountNo=${bankAccountNo}&dpClientId=${dpClientId}`,
      {},
     {});
  }

  getPlaceOrderViewData(clientCode: any): Observable<any> {
    return this.http.post<any>(
      `${this.omsUrl}KRADetailsByClientCode?clientCode=${clientCode}`,
      {},
     {});
  }

  getEditBankViewData(id: any): Observable<any> {
    return this.http.post<any>(`${this.omsUrl}EditBankDetailsByInvId/${id}`, {});
  }
  getOrderTypeData(): Observable<any> {
    return this.http.get<any>(`${this.omsUrl}GetHoldingMaster`);
  }

  getScriptMasterData(): Observable<any> {
    return this.http.get<any>(`${this.omsUrl}GetScripMaster`);
  }

  getHoldingMasterDataList(): Observable<any> {
    return this.http.get<any>(`${this.omsUrl}GetHoldingMasterDataList`);
  }
  getcustomTebleData(orderType: any): Observable<any> {
    return this.http.get<any>(
      `${this.omsUrl}GetHoldingMasterDataList?orderType=${orderType}`,
    );
  }
  getScriptMasterDataPagination(data: any): Observable<any> {
    return this.http.post<any>(`${this.omsUrl}GetScriptMasterList`, data, {});
  }

  postBuyData(orderData: any): Observable<any> {
    return this.http.post<any>(
      `${this.omsUrl}InsertBuySellOrderHistoryData`,
      orderData,
     {});
  }
  postBankDpData(orderData: any): Observable<any> {
    return this.http.post<any>(
      `${this.omsUrl}InsertBuySellOrderHistoryData`,
      orderData,
     {});
  }

  postBankDat(clientCode: any): Observable<any> {
    return this.http.post<any>(
      `${this.omsUrl}BankDetailsByClientCode?clientCode=${clientCode}`,
     {});
  }

  postBankId(clientCode: any): Observable<any> {
    return this.http.post<any>(
      `${this.omsUrl}BankDetailsByClientCode?clientCode=${clientCode}`,
     {});
  }
  postDpData(clientCode: any): Observable<any> {
    return this.http.post<any>(
      `${this.omsUrl}DpDetailsByClientCode?clientCode=${clientCode}`,
     {});
  }

  postDpId(
    id: any,
    BankId: any,
    InvId: any,
    HolderRankId: any,
  ): Observable<any> {
    return this.http.post<any>(
      `${this.omsUrl}GetClientDetailsPlaceOrdeByDpId/${id}/${BankId}/${InvId}/${HolderRankId}`,
     {});
  }

  postOrderType(data: any) {
    return this.http.post<any>(`${this.omsUrl}AddViewCartDataMFNO`, data, {});
  }
  postOrderUnlisted(data: any) {
    return this.http.post<any>(`${this.omsUrl}AddViewCartDataUnlisted`, data, {});
  }
  postOrderlisted(data: any) {
    return this.http.post<any>(`${this.omsUrl}AddViewCartDataListed`, data, {});
  }

  flowTradeSubmit(data: any) {
    return this.http.post<any>(
      `${this.omsUrl}SaveUnlistedFlowtradeDetails`,
      data,
     {});
  }

  getViewCartData(clientCode: any): Observable<any> {
    return this.http.post<any>(
      `${this.omsUrl}ViewNormalMFOrders?clientCode=${clientCode}`,
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

  getAvlandNotionalQty(id: any) {
    return this.http.post<any>(
      `${this.omsUrl}AvailableQuantity?securityId=${id}`,
     {});
  }

  getUnlistedQuantity(data: any) {
    return this.http.post<any>(
      `${this.omsUrl}RecalculateQuantitiesForAllocation`,
      data,
   {});
  }

  getPOABankDetails(entityname: any, productid: any): Observable<any> {
    return this.http.get<any>(
      `${this.omsUrl}GetBankDetailsByEntityName/${entityname}/${productid}`,
    );
  }
  getPOADataUnlisted(data: any): Observable<any> {
    return this.http.post<any>(`${this.omsUrl}GetBankDetailsByClient`, data, {});
  }
  getUnlistedBuyTranch(data: any) {
    return this.http.post<any>(`${this.omsUrl}GetAllocationList`, data, {});
  }

  getFloorPrice(data: any) {
    return this.http.post<any>(`${this.omsUrl}GetFloorPrice`, data, {});
  }

  getUnlistedTaxQty(data: any) {
    return this.http.post<any>(`${this.omsUrl}CalculateTaxAmount`, data, {});
  }
  uploadDealSheatData(id: any) {
    return this.http.post<any>(`${this.omsUrl}UploadUnlistedSheet?id=${id}`, {});
  }

  checkAvailableOrderType(accType: any) {
    return this.http.get<any>(
      `${this.omsUrl}GetActiveOrdersDetailsByAccountType?accounttype=${accType}`,
    );
  }

  getSellingEntityData(
    brokerId: any,
    Isin: any,
    blockerId: any,
  ): Observable<any> {
    return this.http.get<any>(
      `${this.omsUrl}GetBlockOrderDetails?brokerId=${brokerId}&Isin=${Isin}&blockerId=${blockerId}`,
    );
  }

  getTrancheName(data: any) {
    return this.http.post<any>(`${this.omsUrl}GetAvailabeTranches`, data, {});
  }

  getHoldingDetails(data: any) {
    return this.http.post<any>(`${this.omsUrl}GetClientHoldingDetails`, data, {});
  }
  getEntityMaster(): Observable<any> {
    return this.http.get<any>(`${this.omsUrl}GetEntityMaster`);
  }
}
