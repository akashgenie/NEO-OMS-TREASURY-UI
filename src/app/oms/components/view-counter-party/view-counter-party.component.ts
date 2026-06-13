import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/service/shared.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as saveAs from 'file-saver';
import * as moment from 'moment';
import { OmsDashboardService } from '../../oms_services/oms-dashboard.service';
import { ViewCounterPartyService } from '../../oms_services/view_counter_party/view-counter-party.service';
@Component({
  selector: 'app-view-counter-party',
  templateUrl: './view-counter-party.component.html',
  styleUrls: ['./view-counter-party.component.css'],
})
export class ViewCounterPartyComponent {
  showHideFilterInput: boolean = false;
  sortKey: string = 'scripName';
  sortReverse: boolean = false;
  startDate = new Date();
  page: number = 1;
  totalLength: any;
  searchViewData: string = '';
  showHideSearch: boolean = false;
  contactDetailsPopup = false;
  bankDetailsPopup = false;
  demateDetailsPopup = false;
  docDetailsPopup = false;
  filteredData: any = [];
  bankDetails: any;
  demateDetails: any;
  contactDetails: any;
  docDetails: any;
  sortedData: any[] = [];
  documentGetData: any[] = [];
  uploadedFileName: any;
  firstDocumentdetails!: FormGroup;
  firstFileName: any;
  firstFileExtension!: string;
  firstFileData!: string;
  firstPlanebase64!: any[];
  firstAppDocSubmitted: boolean = false;
  uploadDataRes: any;
  showConfirmationFileUplode = false;
  methodDoc = '';
  arrowDirection: { [key: string]: string } = {
    brokerCode: 'asc',
    brokerName: '',
    brokerPan: '',
    brokerDob: '',
    brokerGstNo: '',
    brokerTanNo: '',
    brokerAddr1: '',
    brokerAddr2: '',
  };
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private viewCounterService: ViewCounterPartyService,
    private omsService: OmsDashboardService,
  ) {}
  ngOnInit(): void {
    this.getDashboardData();
    this.sortData(this.sortKey);
    this.createUploadeDoc();
  }
  pageIndex = 0;
  pageSize = 5;
  totalItems = 0;
  totalPages = 0;
  pages: Array<number | '...'> = [];
  searchText: string = '';
  searchTextDashboard!: string;
  private searchDebounce: any;
  buildPayload() {
    return {
      pageNumber: this.pageIndex + 1,
      pageSize: this.pageSize,
      searchTerm: this.searchText || '',
      isClosed: false,
      filterModel: {
        fromDate: null,
        toDate: null,
        id: 0,
        transactionType: '',
        clientConsent: '',
        paymentTransferStatus: '',
        stockTransferStatus: '',
        tradeStatus: '',
        product: '',
        clientName: '',
        accountCode: '',
        pan: '',
        lob: '',
        accountType: '',
        bankPOA: '',
        isinCode: '',
        securityName: '',
        userId: 0,
        refNO: '',
      },
    };
  }
  getDashboardData() {
    const payload = this.buildPayload();
    this.viewCounterService
      .getIViewCounterDashData(payload)
      .subscribe((res: any) => {
        this.filteredData = res?.data?.$values || [];
        this.totalItems = res?.totalRecords || 0;
        this.totalPages = res?.totalPages || 0;
        this.pageSize = res?.pageSize || this.pageSize;
        this.pageIndex = res?.currentPage ? res.currentPage - 1 : 0;
        this.buildPages();
      });
  }
  onSearchChange(event: any): void {
    const searchValue = event.target.value?.trim() || '';
    if (this.searchDebounce) {
      clearTimeout(this.searchDebounce);
    }
    if (searchValue.length >= 4 || searchValue.length === 0) {
      this.searchDebounce = setTimeout(() => {
        this.searchText = searchValue;
        this.pageIndex = 0;
        this.getDashboardData();
      }, 500);
    }
  }
  enableDisableFilter(check: string) {
    if (check == 'enable') {
      this.showHideFilterInput = true;
      this.searchText = '';
      this.clearSearch();
    } else if (check == 'disable') {
      this.showHideFilterInput = false;
      this.searchTextDashboard = '';
      this.searchViewData = '';
      this.searchText = '';
      this.clearSearch();
    }
  }
  clearSearch() {
    this.searchText = '';
    this.pageIndex = 0;
    this.getDashboardData();
  }
  buildPages() {
    const total = this.totalPages;
    const current = this.pageIndex;
    const pages: Array<number | '...'> = [];
    if (total <= 7) {
      this.pages = Array.from({ length: total }, (_, i) => i);
      return;
    }
    if (current <= 3) {
      pages.push(0, 1, 2, 3, 4);
      pages.push('...');
      pages.push(total - 1);
      this.pages = pages;
      return;
    }
    if (current >= total - 4) {
      pages.push(0, '...');
      for (let i = total - 5; i <= total - 1; i++) {
        pages.push(i);
      }
      this.pages = pages;
      return;
    }
    pages.push(0, '...');
    pages.push(current - 1, current, current + 1);
    pages.push('...');
    pages.push(total - 1);
    this.pages = pages;
  }
  goToPage(page: number | '...') {
    if (page === '...') return;
    if (page < 0 || page >= this.totalPages) return;
    if (this.pageIndex === page) return;
    this.pageIndex = page;
    this.getDashboardData();
  }
  formatDateexcel = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
    const year = date.getFullYear();
    return `${day}${month}${year}`;
  };
  enableDisableSearchFilter(check: string) {
    if (check === 'open') {
      this.showHideSearch = true;
    } else if (check === 'close') {
      this.showHideSearch = false;
      localStorage.removeItem('dialog');
    }
  }
  sortData(key: string) {
    if (this.sortKey === key) {
      this.sortReverse = !this.sortReverse;
    } else {
      this.sortKey = key;
      this.sortReverse = false;
    }
    this.arrowDirection = { [key]: this.sortReverse ? 'desc' : 'asc' };
    this.sortedData = this.filteredData?.sort((a: any, b: any) => {
      let x = a[key];
      let y = b[key];
      if (typeof x === 'string') {
        x = x?.toLowerCase();
      }
      if (typeof y === 'string') {
        y = y?.toLowerCase();
      }
      return (x < y ? -1 : x > y ? 1 : 0) * (this.sortReverse ? -1 : 1);
    });
  }
  openContactDetails(data: any) {
    this.contactDetailsPopup = true;
    this.contactDetails = data?.contactPersonDetails?.$values;
  }
  closeContactDetails() {
    this.contactDetailsPopup = false;
  }
  openBankDetails(data: any) {
    this.bankDetails = data?.bankDetails?.$values;
    this.bankDetailsPopup = true;
  }
  closeBankDetails() {
    this.bankDetailsPopup = false;
  }
  openDemateDetails(data: any) {
    this.demateDetailsPopup = true;
    this.demateDetails = data?.dematDetails?.$values;
  }
  closeDemateDetails() {
    this.demateDetailsPopup = false;
  }
  openDocDetails(data: any) {
    this.docDetailsPopup = true;
    this.docDetails = data;
    this.getDocumentDet();
  }
  formatDateNew(dateString: string): string {
    if (dateString == '0001-01-01T00:00:00' || !dateString) {
      return '';
    }
    return moment(dateString).format('DD MMM YYYY HH:mm').toUpperCase();
  }
  closeDocDetails() {
    this.docDetailsPopup = false;
  }
  exportToExcel() {
    const payload = this.buildPayload();
    this.viewCounterService
      .getViewCounterDashboardExcelData(payload)
      .subscribe((res: any) => {
        const currentDate = this.formatDateexcel(new Date());
        const fileName = `VIEWCOUNTERPARTY_REPORT_${currentDate}.xlsx`;
        this.saveAsBlob(res, fileName);
      });
  }
  createUploadeDoc() {
    this.firstDocumentdetails = this.fb.group({
      documentData: [, [Validators.required, Validators.max(1024 * 1024)]],
    });
  }
  resetFirstAppFileUpload() {
    this.firstDocumentdetails.get('documentData')?.reset();
  }
  fileChangeEvent(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const files: any = inputElement.files;
    if (files && files.length > 0) {
      if (files[0]?.size < 10485760) {
        this.firstFileName = files[0].name;
        this.uploadedFileName = files[0].name;
        this.firstFileExtension =
          this.firstFileName.split('.')[
            this.firstFileName.split('.').length - 1
          ];
        const reader = new FileReader();
        reader.onload = () => {
          this.firstFileData = reader.result as string;
          this.firstPlanebase64 = this.firstFileData.split('base64,');
        };
        reader.readAsDataURL(files[0]);
      } else {
        this.firstDocumentdetails.get('documentData')?.reset();
      }
    }
  }
  submitDocumentDetails() {
    this.firstAppDocSubmitted = true;
    if (this.firstDocumentdetails.valid && this.firstFileName) {
      const formData = {
        invid: 0,
        brokerId: this.docDetails.id,
        brokerCode: this.docDetails.brokerCode,
        documentType: 'OTHER',
        documentFileName: this.firstFileName,
        documentFileExtension: this.firstFileExtension,
        documentdata: this.firstPlanebase64[1],
        documentDownloadLink: '',
      };
      this.uploadDataRes = this.viewCounterService
        .documentDetailsPost(formData)
        .subscribe((response: any) => {
          if (response) {
            this.firstAppDocSubmitted = false;
            this.docDetailsPopup = false;
            this.showConfirmationFileUplode = true;
            this.firstDocumentdetails.reset();
            this.methodDoc = 'Document';
          }
        });
    }
  }
  getDocumentDet() {
    this.viewCounterService
      .getDocument(this.docDetails.id)
      .subscribe((res: any) => {
        this.documentGetData = res.$values;
        this.documentGetData;
      });
  }
  viewFirstHolderDoc(docData: any) {
    const paylod = {
      documentName: docData?.documentfilename,
      documentFilePath: docData?.documentfilepath,
    };
    if (docData) {
      this.omsService.downloadDoc(paylod).subscribe((res: any) => {
        if (res) {
          this.saveAsBlob(res, docData.documentfilename);
        }
      });
    }
  }
  saveAsBlob(data: Blob, fileName: any) {
    const blob = new Blob([data], { type: data.type });
    const file = new File([blob], fileName, { type: data.type });
    saveAs(file);
  }
  confirmationDialogFileUpload() {
    this.showConfirmationFileUplode = false;
    this.getDashboardData();
  }
  editCall(id: any) {
    if (id) {
      this.sharedService.addLocalStoragData('counterBrokerID', id);
      this.router.navigate(['/oms/edit_brocker_details']);
    }
  }
}
