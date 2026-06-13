import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class BrockerDetailsService {
  baseUrl = environment.baseUrl;
  omsUrl = environment.omsUrl;

  constructor(private http: HttpClient) {}
  getIfscOptions(ifsc: string): Observable<any> {
    return this.http.get<any>(
      `${this.omsUrl}getBankBranchByIFSC?IFSCCharacter=${ifsc}`,
    );
  }
  getBankInfo(ifscCode: string): Observable<any> {
    return this.http.get<any>(
      `${this.omsUrl}getBankBranchDetailsByIFSCCode?IFSCCode=${ifscCode}`,
    );
  }
  bankDropDownGet(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Master/getBankmaster`);
  }
  VerifyBankDetails(reqObj: any): Observable<any> {
    return this.http.post<any>(`${this.omsUrl}signzy/VerifyBank`, reqObj, {});
  }

  checkPan(data: any): Observable<any> {
    return this.http.post<any>(`${this.omsUrl}Signzy/VerifyPan`, data, {});
  }

  checkAML(fullName: any, pan: any): Observable<any> {
    const params = new HttpParams().set('fullName', fullName).set('pan', pan);

    return this.http.post<any>(
      `${this.omsUrl}Trackwizz/RunAmlScreeningAsync`,
      {},
      { params },
     );
  }

  checkDuplicatePan(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}FormData/DedupeCheck`, data, {});
  }

  brockerDetailsPost(data: any): Observable<any> {
    return this.http.post<any>(`${this.omsUrl}SaveBroker`, data, {});
  }

  getBrockerCode(): Observable<any> {
    return this.http.get(`${this.omsUrl}GetNewBrokerCode`);
  }

  uploadDocumentPost(data: any) {
    return this.http.post<any>(
      `${this.omsUrl}uploadVerificationDocuments`,
      data,
     {});
  }

  sinzyUploadDoc(data: any, brokercode: any) {
    return this.http.post<any>(
      `${this.omsUrl}Signzy/CreateIdentity?brokercode=${brokercode}`,
      data,
     {});
  }

  extractUploadDoc(data: any, brokercode: any) {
    return this.http.post<any>(
      `${this.omsUrl}Signzy/ExtractIdentityForBank?brokercode=${brokercode}`,
      data,
     {});
  }

  getBrockerEditData(id: any): Observable<any> {
    const params = new HttpParams().set('brokerId', id);

    return this.http.get<any>(`${this.omsUrl}GetAllBrokerDetailsByBrokerId`, {
      params,
    });
  }

  sendMail(data: any) {
    return this.http.post<any>(`${this.omsUrl}SendCheckerEmail`, data, {});
  }
}
