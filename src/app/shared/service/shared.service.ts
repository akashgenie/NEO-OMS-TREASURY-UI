import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { EncryptionWrapperService } from '../../service/encryption/encryption-wrapper.service';
import { APP_CONSTANTS } from 'src/app/app-constants';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  opsDashDataLength = new BehaviorSubject<number>(0);

  dealerDashDataLength = new BehaviorSubject<number>(0);

  bondDashDataLength = new BehaviorSubject<number>(0);

  cxoDashDataLength = new BehaviorSubject<number>(0);
  cxoRIADashDataLength = new BehaviorSubject<number>(0);
  mfRIADashDataLength = new BehaviorSubject<number>(0);
  AIFRIADashDataLength = new BehaviorSubject<number>(0);
  blockDashDataLength = new BehaviorSubject<number>(0);
  dematReconDashDataLength = new BehaviorSubject<number>(0);

  cxoMonitoringDataLength = new BehaviorSubject<number>(0);

  productMonitoringDataLength = new BehaviorSubject<number>(0);

  fundManagerDataLength = new BehaviorSubject<number>(0);

  pmsDealingDataLength = new BehaviorSubject<number>(0);

  bondOpsDataLength = new BehaviorSubject<number>(0);

  fundManagerMutualDataLength = new BehaviorSubject<number>(0);

  pmsMutualDashDataLength = new BehaviorSubject<number>(0);

  wsaDashDataLength = new BehaviorSubject<number>(0);
  cxo_AIF_DashDataLength = new BehaviorSubject<number>(0);

  allocationDashDataLength = new BehaviorSubject<number>(0);
  viewCounterDashDataLength = new BehaviorSubject<number>(0);

  unlistedCommonDashDataLength = new BehaviorSubject<number>(0);

  unlistedOperationDashDataLength = new BehaviorSubject<number>(0);

  unlistedPMSDashDataLength = new BehaviorSubject<number>(0);
  bankerDashDataLength = new BehaviorSubject<number>(0);

  baseUrl = environment.baseUrl;

  opsDashData: any;

  cxoDashData: any;
  blockData: any;
  dematReconData: any;
  bondDashData: any;
  dealerDashData: any;
  mfRIAData: any;
  CXO_AIF_DashData: any;
  allocationDashData: any;
  viewCounterDashData: any;
  cxoRIADashData: any;
  aifRIADashData: any;

  cxoMonitoringData: any;

  productMonitoringData: any;

  fundManagerData: any;

  fundManagerMutualData: any;
  mfPMSDashboardData: any;

  pmdsDealingData: any;

  mfPmsDealingData: any;

  bondOpsData: any;

  wsaDashData: any;

  unlistedCommonDashData: any;

  unlistedOperationDashData: any;

  unlistedPMSDashData: any;

  bankerDashData: any;

  panNumberCoApp: string = '';
  panNumberNominee: string = '';
  userPanNo!: string;
  userDOB!: string;
  showBothFlag: boolean = false;
  showAddDetailsFlag: boolean = false;
  showRiskProfilingFlag: boolean = false;
  private addNewClientPan: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  private coAppPan: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private nomineePan: BehaviorSubject<string> = new BehaviorSubject<string>('');
  email: string = '';
  mobileNo: string = '';
  selectedProductId: number | null = null;
  selectedStage: number | null = null;
  setRedirect: boolean = true;
  selectedInvId!: number;
  isModificationViewPage: boolean = false;
  setSelectedModId!: number;
  isEditModification: boolean = false;

  entityTypeSubject = new ReplaySubject<string>(2);

  unAuthorized: boolean = true;

  constructor(
    private http: HttpClient,
    private encryption: EncryptionWrapperService,
  ) {}

  addSessionStorageDataEncrypt(name: string, data: any) {
    if (data) {
      sessionStorage.setItem(name, JSON.stringify(data));
    }
  }

  addSessionStorageData(name: string, data: any) {
    if (name && data) {
      const encryptedName = this.encryption.aesSessionEncrypt(name);
      const jsonString = JSON.stringify(data);
      const encryptedData = this.encryption.aesSessionEncrypt(jsonString);

      sessionStorage.setItem(encryptedName, encryptedData);
    }
  }

  setEditModification(mod: any) {
    this.isEditModification = mod;
  }
  getEditModification() {
    return this.isEditModification;
  }
  setSelectedModificationid(Id: number) {
    this.setSelectedModId = Id;
  }
  getSelectedModificationId() {
    return this.setSelectedModId;
  }

  getSelectedProductId() {
    return this.selectedProductId;
  }
  setSelectedProductId(productId: number) {
    this.selectedProductId = productId;
  }
  setSelectedStage(stage: number) {
    this.selectedStage = stage;
  }
  getSelectedStage() {
    return this.selectedStage;
  }
  getModificationViewPage() {
    return this.isModificationViewPage;
  }
  setModificationViewPage(page: boolean) {
    this.isModificationViewPage = page;
  }
  setStageRedict(stage: boolean) {
    this.setRedirect = stage;
  }
  getStageRedirect() {
    return this.setRedirect;
  }
  setSelectedInvId(InvId: number) {
    this.selectedInvId = InvId;
  }
  getSelectedInvId() {
    return this.selectedInvId;
  }
  getSessionStorageDataEncrypt(name: string) {
    let data: any = sessionStorage.getItem(name);
    data = JSON.parse(data);
    return data;
  }

  getSessionStorageData(name: any) {
    if (!name) return null;

    const encryptedName = this.encryption.aesSessionEncrypt(name);

    const encryptedData = sessionStorage.getItem(encryptedName);
    if (!encryptedData) return null;

    try {
      const decrypted = this.encryption.aesSessionDecrypt(encryptedData);
      return JSON.parse(decrypted);
    } catch (error) {
      return null;
    }
  }

  getLocalStorageData(type: any) {
    if (!type) return null;

    const encryptedName = this.encryption.aesSessionEncrypt(type);
    const encryptedData = sessionStorage.getItem(encryptedName);
    if (!encryptedData) return null;

    try {
      const decrypted = this.encryption.aesSessionDecrypt(encryptedData);
      return JSON.parse(decrypted);
    } catch (error) {
      return null;
    }
  }

  removeSessionStorageData(data: any) {
    const encryptedName = this.encryption.aesSessionEncrypt(data);
    sessionStorage.removeItem(encryptedName);
  }

  addLocalStoragData(session: string, data: any) {
    if (session && data) {
      const encryptedName = this.encryption.aesSessionEncrypt(session);
      const jsonString = JSON.stringify(data);
      const encryptedData = this.encryption.aesSessionEncrypt(jsonString);
      sessionStorage.setItem(encryptedName, encryptedData);
    }
  }

  insertLocalStoragData(type: string, data: any) {
    if (type && data) {
      const encryptedName = this.encryption.aesSessionEncrypt(type);
      const jsonString = JSON.stringify(data);
      const encryptedData = this.encryption.aesSessionEncrypt(jsonString);

      localStorage.setItem(encryptedName, encryptedData);
    }
  }

  giveLocalStorageData(session: any) {
    if (!session) return null;

    const encryptedName = this.encryption.aesSessionEncrypt(session);
    const encryptedData = localStorage.getItem(encryptedName);
    if (!encryptedData) return null;

    try {
      const decrypted = this.encryption.aesSessionDecrypt(encryptedData);
      return JSON.parse(decrypted);
    } catch (error) {
      return null;
    }
  }

  removeLocalStorageItem(data: any) {
    const encryptedName = this.encryption.aesSessionEncrypt(data);
    localStorage.removeItem(encryptedName);
  }

  private registrationCertificateUploaded = new BehaviorSubject<boolean>(false);
  registrationCertificateUploaded$ =
    this.registrationCertificateUploaded.asObservable();

  setRegistrationCertificateUploaded(status: boolean) {
    this.registrationCertificateUploaded.next(status);
  }

  setAddNewClientPan(pan: string): void {
    this.addNewClientPan.next(pan);
  }

  getAddNewClientPan(): Observable<string> {
    return this.addNewClientPan.asObservable();
  }

  setCoAppPan(pan: string): void {
    this.coAppPan.next(pan);
  }

  getCoAppPan(): Observable<string> {
    return this.coAppPan.asObservable();
  }

  setNomineePan(pan: string): void {
    this.nomineePan.next(pan);
  }

  getNomineePan(): Observable<string> {
    return this.nomineePan.asObservable();
  }
  setEmailAndMobile(email: string, mobileNo: string) {
    this.email = email;
    this.mobileNo = mobileNo;
  }

  getEmail(): string {
    return this.email;
  }

  getMobileNo(): string {
    return this.mobileNo;
  }

  updateFilteredDataLength(length: number, section: any) {
    if (section == 'operation') {
      this.opsDashDataLength.next(length);
    }
    if (section == 'dealer') {
      this.dealerDashDataLength.next(length);
    }
    if (section == 'bond') {
      this.bondDashDataLength.next(length);
    }
    if (section == 'cxo') {
      this.cxoDashDataLength.next(length);
    }
    if (section == 'cxo_RIA') {
      this.cxoRIADashDataLength.next(length);
    }
    if (section == 'MF_RIA') {
      this.mfRIADashDataLength.next(length);
    }
    if (section == 'AIF_RIA') {
      this.AIFRIADashDataLength.next(length);
    }
    if (section == 'cxoMonitoring') {
      this.cxoMonitoringDataLength.next(length);
    }
    if (section == 'productMonitoring') {
      this.productMonitoringDataLength.next(length);
    }
    if (section == 'fundManager') {
      this.fundManagerDataLength.next(length);
    }
    if (section == 'pmsDealing') {
      this.pmsDealingDataLength.next(length);
    }
    if (section == 'bondOps') {
      this.bondOpsDataLength.next(length);
    }
    if (section == 'fundManagerMutual') {
      this.fundManagerMutualDataLength.next(length);
    }
    if (section == 'pmsMutualFundData') {
      this.pmsMutualDashDataLength.next(length);
    }
    if (section == 'wsa') {
      this.wsaDashDataLength.next(length);
    }
    if (section == 'cxo_AIF') {
      this.cxo_AIF_DashDataLength.next(length);
    }
    if (section == 'allocation_dash') {
      this.allocationDashDataLength.next(length);
    }
    if (section == 'viewCounter_dash') {
      this.viewCounterDashDataLength.next(length);
    }
    if (section == 'block') {
      this.blockDashDataLength.next(length);
    }
    if (section == 'demat_Recon') {
      this.dematReconDashDataLength.next(length);
    }
    if (section == 'unlistedCommon') {
      this.unlistedCommonDashDataLength.next(length);
    }
    if (section == 'unlistedOperation') {
      this.unlistedOperationDashDataLength.next(length);
    }
    if (section == 'unlistedPMS') {
      this.unlistedPMSDashDataLength.next(length);
    }
    if (section == 'banker') {
      this.bankerDashDataLength.next(length);
    }
  }

  getExpectedCorpusData(id: any): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}FormData/getInvestorDetailsByInvId?InvId=${id}`,
    );
  }
}
