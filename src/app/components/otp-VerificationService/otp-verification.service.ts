import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class OtpVerificationService {
  constructor(private http: HttpClient) {}
  baseUrl = environment.baseUrl;

  autheticateUser(token: any): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}Authentication/getEmailAndMobileDetailsOfClientForVerification?token=${token}`,
    );
  }

  verifyUser(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}Authentication/verifyClientEmailAndMobile`,
      data,
    , {});
  }
  verifyReviewPageOtp(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}Authentication/VerifyClientEmailandMobileOTPByCXO`,
      data,
    , {});
  }

  resendOTP(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}ThirdPartyApi/Notification/ReSendEmail`,
      data,
    , {});
  }
  checkRedirect(invId: any, stage: any): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}Stage/CheckRedirect/${invId}/${stage}`,
    );
  }
  getRedirect(invId: any, stage: any): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}Stage/GetRedirect/${invId}/${stage}`,
    );
  }

  getEmailVerificationData(invId: any, holderRankId: any) {
    return this.http.get<any>(
      `${this.baseUrl}Stage/GetEmailOTPConsentDetails/${invId}/${holderRankId}`,
    );
  }

  getMobileVerificationData(invId: any, holderRankId: any) {
    return this.http.get<any>(
      `${this.baseUrl}Stage/GetMobileOTPConsentDetails/${invId}/${holderRankId}`,
    );
  }

  getIpvLink(invId: any, holderRankId: any) {
    return this.http.get<any>(
      `${this.baseUrl}Stage/GetSingleJourneyIpvLink/${invId}/${holderRankId}`,
    );
  }

  checkHolderIPVStatus(invId: any, holderRankId: any) {
    return this.http.get<any>(
      `${this.baseUrl}Stage/GetSingleJourneyIpvStatus/${invId}/${holderRankId}`,
    );
  }

  checkIPVStage(invId: any) {
    return this.http.get<any>(`${this.baseUrl}Stage/CompleteIPVStage/${invId}`);
  }

  checkHolderEsignStatus(invId: any, holderRankId: any) {
    return this.http.get<any>(
      `${this.baseUrl}Stage/GetSingleJourneyAllEsignStatus/${invId}/${holderRankId}`,
    );
  }

  getHolderEsignDetails(invId: any, holderRankId: any) {
    return this.http.get<any>(
      `${this.baseUrl}Stage/GetSingleJourneyEsignLinks/${invId}/${holderRankId}`,
    );
  }

  checkDocStatus(invId: any, holderRankId: any) {
    return this.http.get<any>(
      `${this.baseUrl}Stage/GetSingleJourneyEsignPdfTypeStatus/${invId}/${holderRankId}`,
    );
  }

  checkLink(token: any) {
    return this.http.get<any>(
      `${this.baseUrl}Stage/GetSingleJourneyInvHolderRankId/${token}`,
    );
  }

  getFormState(invId: any, holderRankId: any) {
    return this.http.get<any>(
      `${this.baseUrl}Stage/GetSingleJourneyAllStageStatus/${invId}/${holderRankId}`,
    );
  }

  resendMobOTP(token: any): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}Stage/ResendMobileOTP?Guid=${token}`,
    );
  }
}
