import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, ObservedValueOf } from 'rxjs';
import { Clientmaster } from 'src/app/model/clientmaster';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ClientmasterService {
  baseUrl = environment.baseUrl;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'ngrok-skip-browser-Warning': 'true',
      'Access-Control-Allow-Origin': '*',
    }),
  };

  constructor(private http: HttpClient) {}

  getpersonal(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Personal/getPersonalById/${id}`);
  }
  getaddress(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Address/getpermanentById/${id}`);
  }
  getfatca(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Personal/getFatcaById/${id}`);
  }
  getnewapplicant(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}Personal/getAddApplicantById/${id}`,
    );
  }
  getbank(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Bank/getInvestorBankByID/${id}`);
  }
  getnominee(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Onboarding/getNomineeById/${id}`);
  }
  getclient(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Onboarding/getNomineeById/${id}`);
  }

  getPin(pin: any): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}Master/getPINcodeMasterBySearch?PINCodeCharacter=${pin}`,
    );
  }

  getDataFromPin(pin: any): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}Master/getPINcodeMasterDetails?PINCode=${pin}`,
    );
  }

  getcountry(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}Master/getCountrymasterById/${id}`,
    );
  }
  getcity(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Master/getCityMaster`);
  }
  getstate(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Master/getStateMaster`);
  }

  getDistrict(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Master/getDistrictmaster`);
  }

  getbankmaster(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Master/getBankmasterById/${id}`);
  }
  getbankbranch(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}Master/getBankbranchmasterById/${id}`,
    );
  }
  getpdf(id: any) {
    return this.http.get(`${this.baseUrl}v1/GetMeargePDF/download-zip/1`, {
      observe: 'response',
      responseType: 'blob',
    });
  }
  postUploadFile(formData: FormData) {
    return this.http.post<any>('YOUR_API_URL', formData, {});
  }

  getAllEmails(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}Usermaster/GetEmail`);
  }

  getAllProducts(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Master/getProductMaster`);
  }

  getAllFunds(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Master/getFundMaster`);
  }

  getAllCXO(id: any): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}Master/getEmployeeMasterByBankerId?bankerId=${id}`,
    );
  }

  getAllCXOByDistributor(id: any): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}Master/getEmployeeMasterByDistributorId?disId=${id}`,
    );
  }

  getAllCXODetails(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Master/getEmployeeMaster`);
  }

  getBankerDetailsByCXOId(id: any): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}Master/getBankerMasterByCxo?cxoId=${id}`,
    );
  }

  getAllIFSC(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Master/getallBankbranch`);
  }

  getAllBankers(id: any): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}Master/getBankerMasterByEntityId?entityId=${id}`,
    );
  }

  getAllDropdown(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Master/getEnumMaster`);
  }

  getAllEntity(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Master/getEntityMaster`);
  }

  getAllDistributor(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Master/getDistributorMaster`);
  }

  getFamilyMaster(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Master/getFamilyMaster`);
  }

  getAllCountries(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Master/getCountryMaster`);
  }

  getckycValue(
    pan: string,
    dob: string,
    ckycNumber: string,
    invId: any,
  ): Observable<any> {
    let reqObj = {
      pan: pan,
      dob: dob,
      ckynUmber: ckycNumber,
      invId: invId,
      holderRankId: 1,
    };
    return this.http.post<any>(
      `${this.baseUrl}ThirdPartyApi/CKYC/DownloadKYC`,
      reqObj,
     {});
  }

  checkPan(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}ThirdPartyApi/Signzy/PanStatus`,
      data,
     {});
  }

  getKRAStatus(reqbody: any): Observable<any> {
    const url = `${this.baseUrl}ThirdPartyApi/PMS/GetKRAStatus`;
    return this.http.post<any>(url, reqbody, {});
  }

  checkDuplicatePan(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}FormData/DedupeCheckHoldingPattern`,
      data,
     {});
  }
  deleteContactDetails(id: any): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}FormData/DeleteContactDetailsById/${id}`,
    );
  }
  deleteControllingPerson(id: any): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}FormData/DeleteControllingPersonById/${id}`,
    );
  }
  deleteTaxResident(id: any): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}FormData/DeleteTaxResidentById/${id}`,
    );
  }

  sendStartJourneyMail(invId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}FormData/sendStartJourneyMail?InvId=${invId}`,
    );
  }

  getAllBankersFromDist(id: any): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}Master/getbankerBydistributorid?disId=${id}`,
    );
  }

  pmsClientValidation(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}FormData/PMS/ClientValidations`,
      data,
     {});
  }

  sendEmail(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}ThirdPartyApi/Notification/SendEmail?NotificationType=ICICIPMSEmailTemplate`,
      data,
     {});
  }

  uploadBarcodes(data: {
    documentData: string;
    fileName: string;
  }): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}FormData/UploadBarcodeExcel`,
      data,
     {});
  }

  fetchCVLAddress(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}ThirdPartyApi/CvlKra/FetchAddress`,
      data,
     {});
  }
}
