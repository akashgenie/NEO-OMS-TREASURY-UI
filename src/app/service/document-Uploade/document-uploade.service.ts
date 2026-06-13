import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DocumentUploadeService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  documentDetailsPost(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}DocumentUpload/uploadDocuments`,
      data,
    , {});
  }
  documentDetailsDelete(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}DocumentUpload/deleteDocumentById?id=${data}`,
    , {});
  }
  getAllDropdown(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Master/getDocumentTypeMaster`);
  }

  getNonIndDocOptions(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}Master/getNonInvDocumentTypeMaster`,
    );
  }

  getAllDocumentTypeMaster(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Master/getAllDocumentTypeMaster`);
  }

  getNonAllDropdown(statusId: any): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}Master/getDocumentTypeMaster?clienttypeid=${statusId}`,
    );
  }

  getNomineeDocDropdown(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}Master/getNomineeDocumentTypeMaster`,
    );
  }

  getHolderDocDet(id: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}DocumentUpload/getDocumentDetailsByInvId?InvId=${id}`,
    );
  }
  identityExtract(invid: any, holderRankId: any, reqObj: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}ThirdPartyApi/Signzy/CreateIdentity/${invid}/${holderRankId}`,
      reqObj,
    , {});
  }
  ExtractIdentity(invid: any, holderRankId: any, reqObj: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}ThirdPartyApi/Signzy/ExtractIdentity/${invid}/${holderRankId}`,
      reqObj,
    , {});
  }
  NameMatcher(reqObj: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}ThirdPartyApi/Signzy/NameMatchers`,
      reqObj,
    , {});
  }
  downloadDoc(filePath: any, fileName: any): Observable<any> {
    return this.http.get(
      `${this.baseUrl}ThirdParty/downloadDocument?filePath=${filePath}&fileName=${fileName}`,
      { responseType: 'blob' },
    );
  }

  getDocKRASetDetails(invId: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}FormData/GetKRASetDetailsByInvId/${invId}`,
    );
  }
}
