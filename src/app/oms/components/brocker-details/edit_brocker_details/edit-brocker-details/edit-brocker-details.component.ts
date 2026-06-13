import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { map, Observable, startWith } from 'rxjs';
import { DeleteConfirmationDialogComponentComponent } from 'src/app/components/delete-confirmation-dialog-component/delete-confirmation-dialog-component/delete-confirmation-dialog-component.component';
import { DuplicatePanComponent } from 'src/app/components/duplicate-pan/duplicate-pan.component';
import { OmsDashboardService } from 'src/app/oms/oms_services/oms-dashboard.service';
import { PanVerifyDecryptedService } from 'src/app/oms/oms_services/panVerify_decrypted/pan-verify-decrypted.service';
import { ClientmasterService } from 'src/app/service/clientmaster.service';
import { CommonErrorDialogComponent } from 'src/app/shared/components/common-error-dialog/common-error-dialog.component';
import { SharedService } from 'src/app/shared/service/shared.service';
import * as saveAs from 'file-saver';
import { BrockerDetailsService } from 'src/app/oms/oms_services/brocker_details/brocker-details.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-edit-brocker-details',
  templateUrl: './edit-brocker-details.component.html',
  styleUrls: ['./edit-brocker-details.component.css'],
})
export class EditBrockerDetailsComponent implements OnInit {
  @ViewChild('Dob') Dob: any;
  @ViewChild('form') form!: ElementRef;
  brokerForm!: FormGroup;
  panDetailsSubmitted = false;
  bankDetailsSubmitted = false;
  demateDetailsSubmitted = false;
  makeFieldsDisable = false;
  allowDedup = false;
  panDocumentRequired = false;
  panVerified: any;
  panDedupeStatus: any;
  showVerificationIcon = false;
  showVerificationIconRed = false;
  penidropStatusFlag: boolean[] = [true, true, true, true, true];
  verifyAccFlag: boolean[] = [true];
  showSuccessIcon: boolean[] = [false];
  showFailIcon: boolean[] = [false];
  pennyDropFailure: boolean[] = [];
  bankFileProofNames: string[] = [];
  bankFilesProof: File[] = [];
  ifscCodeOptions: any[] = [];
  ifscOptions: Observable<any>[] = [];
  allDropdownOptions: any[] = [];
  bankDropdownOption: any[] = [];
  bankAccountTypeOptions: any[] = [];
  bankNameOptions: any[] = [];
  fileNames: string[] = [];
  dematFileNames: string[] = [];
  panDocumentFile: File | null = null;
  gstDocumentFile: File | null = null;
  otherDocumentFiles: File[] = [];
  gstFileName: string = '';
  panFileName: string = '';
  otherFileNames: string = '';
  dematFiles: File[] = [];
  gstFileDocDownloadName: string = '';
  gstFileDownloadPath: string = '';
  otherFileDocDownloadName: string = '';
  otherFileDownloadPath: string = '';
  panFileDocumentName: string = '';
  panFileDocumentPath: string = '';
  showHideFlag: any[] = [true, true, true, true, true];
  constructor(
    private fb: FormBuilder,
    private brockerDetailsService: BrockerDetailsService,
    private clientService: ClientmasterService,
    private dialog: MatDialog,
    private panVerifyService: PanVerifyDecryptedService,
    private sharedService: SharedService,
    private omsService: OmsDashboardService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    const editId = this.sharedService.getLocalStorageData('counterBrokerID');
    this.fetchBrokerEditData(editId);
    this.initializeForm();
    this.loadDropdownOptions();
  }
  amlFileDocDownloadName: string | null = null;
  amlFileDownloadPath: string | null = null;
  amlStatus: string | null = null;
  isAmlProceed: boolean | null = null;
  brokerCheckerStatus: string = '';
  fetchBrokerEditData(id: string): void {
    this.brockerDetailsService.getBrockerEditData(id).subscribe((response) => {
      if (response) {
        this.brokerCheckerStatus = response.brokerCheckerStatus;
        const panDetail = response.brokerPanDetails?.$values?.[0];
        if (panDetail) {
          this.showVerificationIcon = panDetail.isVerified;
          this.showVerificationIconRed = !panDetail.isVerified;
          this.panFileDocumentName = panDetail.documentName;
          this.panFileDocumentPath = panDetail.documentPath;
        }
        if (response.aMlDoc) {
          this.amlFileDocDownloadName = response.aMlDoc.documentName;
          this.amlFileDownloadPath = response.aMlDoc.documentPath;
        }
        this.amlStatus = response.amlStatus;
        this.isAmlProceed = response.isAmlProceed;
        if (response.gstDocuments) {
          this.gstFileDocDownloadName = response.gstDocuments.documentName;
          this.gstFileDownloadPath = response.gstDocuments.documentPath;
        }
        if (response.otherDocumets) {
          this.otherFileDocDownloadName = response.otherDocumets.documentName;
          this.otherFileDownloadPath = response.otherDocumets.documentPath;
        }
        this.brokerForm.patchValue({
          brokerCode: response.brokerCode,
          brokerName: response.brokerName,
          panNo: response.brokerPanDetails?.$values?.[0]?.panno || '',
          dob: response.brokerDob,
          gstNo: response.brokerGstNo,
          tanNo: response.brokerTanNo,
          address: response.brokerAddr1,
          address2: response.brokerAddr2,
          fileName: response.brokerDocuments?.$values?.[0] || '', // first file
          file: '',
          amlStatus: response.amlStatus,
        });
        const contactArray = this.brokerForm.get('contactDetails') as FormArray;
        contactArray.clear(); // Clear default
        response.contactPersonDetails?.$values?.forEach((contact: any) => {
          contactArray.push(
            this.fb.group({
              contactId: [contact.contactId],
              name: [contact.contactPersonName],
              email: [contact.email],
              mobileNo: [contact.mobileNo],
            }),
          );
        });
        const bankArray = this.brokerForm.get('bankDetails') as FormArray;
        bankArray.clear();
        response.bankDetails?.$values?.forEach((bank: any) => {
          const group = this.fb.group({
            bankId: [bank.bankId],
            bankAccount: [bank.bankAccountNo],
            reBankAccount: [bank.bankAccountNo],
            ifscCode: [bank.ifscCode],
            branchName: [bank.branchName],
            micr: [bank.micr],
            accountType: [bank.accountType],
            bankName: [''],
            verificationStatus: [bank.isVerified ? 'Verified' : 'Not Verified'],
            bankFile: [null],
            primaryAccount: [bank.isPrimary],
            bankDocumentName: [bank.bankDocumentName || ''],
            bankDocumentFilePath: [bank.bankDocumentFilePath || ''],
            bankOCRDocumentName: [bank.bankOCRDocumentName || ''],
            bankOCRDocumentFilePath: [bank.bankOCRDocumentFilePath || ''],
            readOnly: [true],
            isVerified: [bank.isVerified],
            isNew: [false],
          });
          bankArray.push(group);
        });
        const dematArray = this.brokerForm.get('dematDetails') as FormArray;
        dematArray.clear();
        response.dematDetails?.$values?.forEach((demat: any) => {
          const demateGroup = this.fb.group({
            dematId: [demat.dematId],
            depository: [demat.depository],
            dematAccount: [demat.dematAccountNo],
            reDematAccount: [demat.dematAccountNo],
            verificationStatus: [
              demat.isVerified ? 'Verified' : 'Not Verified',
            ],
            demateFile: [null],
            isDemateDocUploded: [false],
            dematFileName: [''],
            dematDocumentName: [demat.dematDocumentName || ''],
            dematDocumentFilePath: [demat.dematDocumentFilePath || ''],
            readOnlyDemate: [true],
            isNewDemate: [false],
          });
          dematArray.push(demateGroup);
        });
      }
    });
  }
  amlResponse: any = null;
  amlRequired: boolean = false;
  amlDocumentFile: File | null = null;
  amlDocumentBase64: string | null = null;
  checkAMLVerify() {
    const panControl = this.brokerForm.get('panNo');
    const nameControl = this.brokerForm.get('brokerName');
    panControl?.markAsTouched();
    nameControl?.markAsTouched();
    if (panControl?.valid && nameControl?.valid) {
      this.brockerDetailsService
        .checkAML(nameControl?.value, panControl?.value)
        .subscribe((res: any) => {
          this.amlResponse = res;
          this.amlRequired = !res.isAmlProceed; // if false → require doc upload
        });
    }
  }
  fileChangeEvent(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.amlDocumentFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.amlDocumentBase64 = (reader.result as string).split(',')[1]; // Base64 only
      };
      reader.readAsDataURL(file);
    }
  }
  initializeForm(): void {
    this.brokerForm = this.fb.group({
      brokerCode: ['', Validators.required],
      brokerName: ['', [Validators.required, this.noWhitespaceValidator()]],
      amlStatus: [''],
      panNo: [
        '',
        [
          Validators.required,
          Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}'),
          this.panValidator(),
        ],
      ],
      dob: [
        '',
        [Validators.required, this.checkDate(), this.checkFutureDate()],
      ],
      gstNo: [
        '',
        [
          Validators.pattern(
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}Z[0-9A-Z]{1}$/,
          ),
          this.gstValidator(),
        ],
      ],
      tanNo: ['', [this.tanValidator()]],
      address: ['', [Validators.required, this.noWhitespaceValidator()]],
      address2: [''],
      contactDetails: this.fb.array([this.createContactGroup(true)]),
      bankDetails: this.fb.array([this.createBankFormGroup()]),
      dematDetails: this.fb.array([this.createDematFormGroup()]),
      fileName: [''],
      file: [''],
    });
  }
  createBankFormGroup(readOnly: boolean = false): FormGroup {
    return this.fb.group({
      bankAccount: ['', [Validators.required, this.checkDuplicateAccNo()]],
      reBankAccount: ['', Validators.required],
      ifscCode: ['', Validators.required],
      branchName: ['', Validators.required],
      micr: ['', Validators.required],
      accountType: ['', Validators.required],
      bankName: [''],
      verificationStatus: ['Not Verified'],
      bankFile: [null],
      primaryAccount: [false],
      readOnly: [readOnly],
      isNew: [true],
    });
  }
  createContactGroup(required: boolean = false): FormGroup {
    return this.fb.group({
      name: ['', required ? Validators.required : []],
      email: [
        '',
        required ? [Validators.required, Validators.email] : [Validators.email],
      ],
      mobileNo: ['', required ? Validators.required : []],
    });
  }
  createDematFormGroup(readOnlyDemate: boolean = false): FormGroup {
    return this.fb.group({
      depository: ['', [Validators.required, this.noWhitespaceValidator()]],
      dematAccount: ['', []],
      reDematAccount: [''],
      verificationStatus: ['Not Verified'],
      demateFile: [null],
      isDemateDocUploded: [false],
      dematFileName: [''],
      readOnlyDemate: [readOnlyDemate],
      isNewDemate: [true],
    });
  }
  get bankDetailsArray() {
    return this.brokerForm.get('bankDetails') as FormArray;
  }
  get dematDetailsArray() {
    return this.brokerForm.get('dematDetails') as FormArray;
  }
  get contactDetails(): FormArray {
    return this.brokerForm.get('contactDetails') as FormArray;
  }
  addContact(): void {
    if (this.contactDetails.length < 10) {
      this.contactDetails.push(this.createContactGroup());
    }
  }
  removeContact(index: number): void {
    if (this.contactDetails.length > 1) {
      this.contactDetails.removeAt(index);
    }
  }
  loadDropdownOptions(): void {
    this.getAllDropdownOptions();
    this.getBankDropdownOptions();
  }
  getAllDropdownOptions(): void {
    this.clientService.getAllDropdown().subscribe((res: any) => {
      if (res) {
        this.allDropdownOptions = res;
        this.bankAccountTypeOptions = [];
        this.bankNameOptions = [];
        this.allDropdownOptions.forEach((item: any) => {
          if (item.enumType === 'BankAccountType') {
            this.bankAccountTypeOptions.push(item);
          }
          if (item.enumType === 'bankName') {
            this.bankNameOptions.push(item);
          }
        });
      }
    });
  }
  getBankDropdownOptions(): void {
    this.brockerDetailsService.bankDropDownGet().subscribe((res: any) => {
      if (res) {
        this.bankDropdownOption = res;
        this.bankNameOptions = [];
      }
    });
  }
  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace =
        (control.value || '').toString().trim().length !==
        (control.value || '').toString().length;
      return isWhitespace ? { whitespace: true } : null;
    };
  }
  panValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      return panPattern.test(control.value) ? null : { invalidPan: true };
    };
  }
  gstValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const gstPattern =
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}Z[0-9A-Z]{1}$/;
      return gstPattern.test(control.value) ? null : { invalidGst: true };
    };
  }
  tanValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const tanPattern = /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/;
      return tanPattern.test(control.value) ? null : { invalidTan: true };
    };
  }
  checkDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.Dob?.nativeElement?.value) {
        const dateRegex =
          /^([0]?[1-9]|[1|2][0-9]|[3][0|1])[/-]([0]?[1-9]|[1][0-2])[/-]([0-9]{4}|[0-9]{2})$/;
        if (!dateRegex.test(this.Dob?.nativeElement?.value)) {
          return { date: true };
        }
      }
      return null;
    };
  }
  checkFutureDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const currentDate = new Date();
      const enteredDate = new Date(control.value);
      currentDate.setHours(0, 0, 0, 0);
      if (enteredDate >= currentDate) {
        return { futureDate: true };
      }
      return null;
    };
  }
  checkPan(event: any): void {
    const input = event.target;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const upperCaseValue = input.value.toUpperCase();
    this.brokerForm
      .get('panNo')
      ?.patchValue(upperCaseValue, { emitEvent: false });
    setTimeout(() => {
      input.setSelectionRange(start, end);
    });
  }
  checkTan(event: any): void {
    const input = event.target;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const upperCaseValue = input.value.toUpperCase();
    this.brokerForm
      .get('tanNo')
      ?.patchValue(upperCaseValue, { emitEvent: false });
    setTimeout(() => {
      input.setSelectionRange(start, end);
    });
  }
  checkGst(event: any): void {
    const input = event.target;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const upperCaseValue = input.value.toUpperCase();
    this.brokerForm
      .get('gstNo')
      ?.patchValue(upperCaseValue, { emitEvent: false });
    setTimeout(() => {
      input.setSelectionRange(start, end);
    });
  }
  allowOnlyAlphabets(event: KeyboardEvent): void {
    const pattern = /^[a-zA-Z\s]*$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  disableCopyPaste(event: ClipboardEvent) {
    event.preventDefault();
  }
  restrictSpecialCharacters(event: KeyboardEvent): void {
    const pattern = /^[a-zA-Z0-9]*$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  filterDates = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d ? d < today : false;
  };
  addBankDetails(): void {
    if (this.bankDetailsArray.length < 5) {
      this.bankDetailsArray.push(this.createBankFormGroup(false)); // explicitly set readOnly = false
    }
  }
  getPrimaryAccountIndex(): number {
    if (this.bankDetailsArray && this.bankDetailsArray.length > 0) {
      for (let i = 0; i < this.bankDetailsArray.length; i++) {
        const control = this.bankDetailsArray.at(i).get('primaryAccount');
        if (control && control.value === true) {
          return i;
        }
      }
    }
    return -1;
  }
  onPrimaryAccountChange(index: number, event: any): void {
    if (
      this.brokerCheckerStatus === 'CHECKER PENDING' ||
      this.brokerCheckerStatus === 'REJECTED'
    ) {
      const control = this.bankDetailsArray.at(index).get('primaryAccount');
      control?.setValue(!event.target.checked, { emitEvent: false });
      return;
    }
    const isChecked = event.target.checked;
    if (isChecked) {
      for (let i = 0; i < this.bankDetailsArray.length; i++) {
        if (i !== index) {
          this.bankDetailsArray.at(i).get('primaryAccount')?.setValue(false);
        }
      }
    }
  }
  shouldShowPrimaryCheckbox(index: number): boolean {
    const currentPrimaryIndex = this.getPrimaryAccountIndex();
    return currentPrimaryIndex === -1 || currentPrimaryIndex === index;
  }
  deleteBankDetails(index: any): void {
    const dialogRef = this.dialog.open(
      DeleteConfirmationDialogComponentComponent,
      {
        width: '350px',
        data: {
          message:
            'Are you sure you want to delete this bank account details ?',
        },
      },
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.removeBankDetails(index);
        this.showSuccessIcon[index] = false;
        this.showFailIcon[index] = false;
      } else {
      }
    });
  }
  deletedeamatDetails(index: any): void {
    const dialogRef = this.dialog.open(
      DeleteConfirmationDialogComponentComponent,
      {
        width: '350px',
        data: {
          message: 'Are you sure you want to delete this demat details ?',
        },
      },
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.removeDematDetails(index);
      } else {
      }
    });
  }
  deletedContactDetails: any[] = [];
  deleteContactDetails(index: any): void {
    const dialogRef = this.dialog.open(
      DeleteConfirmationDialogComponentComponent,
      {
        width: '350px',
        data: {
          message: 'Are you sure you want to delete this contact details?',
        },
      },
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const contactArray = this.brokerForm.get('contactDetails') as FormArray;
        const contact = contactArray.at(index).value;
        if (contact.contactId && contact.contactId !== 0) {
          this.deletedContactDetails.push({
            ...contact,
            isDeleted: true,
          });
        }
        this.removeContact(index);
      }
    });
  }
  deletedBankDetails: any[] = [];
  removeBankDetails(index: number): void {
    const bankGroup = this.bankDetailsArray.at(index);
    const bankData = bankGroup?.value;
    if (bankData && bankData.bankId && bankData.bankId !== 0) {
      this.deletedBankDetails.push({
        bankId: bankData.bankId,
        bankAccountNo: bankData.bankAccount, // Map from form field name
        reEnterBankAccountNo: bankData.reBankAccount, // Map from form field name
        ifsccode: bankData.ifscCode, // Map from form field name
        branchName: bankData.branchName,
        micr: bankData.micr,
        accountType: bankData.accountType,
        isPrimary: bankData.primaryAccount || false,
        isVerified:
          bankData.isVerified || bankData.verificationStatus === 'Verified',
        isBankDocUploded: !!bankData.bankFile,
        bankDocumentData: null,
        isDeleted: true,
      });
    }
    this.bankDetailsArray.removeAt(index);
    this.fileNames.splice(index, 1);
    this.pennyDropFailure.splice(index, 1);
  }
  checkDuplicateAccNo(): any {
    return (control: any): any => {
      if (!control.value) {
        return null;
      }
      const ifscCode = control.value.toLowerCase();
      if (this.bankDetailsArray) {
        const allAcc = [
          ...this.bankDetailsArray?.controls.map((group: any) =>
            group?.get('bankAccount').value?.toLowerCase(),
          ),
        ];
        let count = 0;
        for (let i = 0; i < allAcc.length; i++) {
          if (allAcc[i] === ifscCode && allAcc[i] != '') {
            count++;
          }
        }
        if (count >= 2) {
          return { bankDupAcc: true };
        }
      }
      return null;
    };
  }
  checkDuplicateIFSC(): any {
    return (control: any): any => {
      if (!control.value) {
        return null;
      }
      const ifscCode = control.value.toLowerCase();
      if (this.bankDetailsArray) {
        const allAcc = [
          ...this.bankDetailsArray?.controls.map((group: any) =>
            group?.get('ifscCode').value?.toLowerCase(),
          ),
        ];
        let count = 0;
        for (let i = 0; i < allAcc.length; i++) {
          if (allAcc[i] === ifscCode && allAcc[i] != '') {
            count++;
          }
        }
        if (count >= 2) {
          return { bankDupIFSC: true };
        }
      }
      return null;
    };
  }
  checkBankAccountMatch(index: number): void {
    const bankFormGroup = this.bankDetailsArray.at(index) as FormGroup;
    const bankAcc = bankFormGroup.get('bankAccount')?.value;
    const reBankAcc = bankFormGroup.get('reBankAccount')?.value;
    if (bankAcc && reBankAcc) {
      if (bankAcc !== reBankAcc) {
        bankFormGroup
          .get('reBankAccount')
          ?.setErrors({ accountMismatch: true });
      } else {
        bankFormGroup.get('reBankAccount')?.setErrors(null);
      }
    }
  }
  showHide(index: number) {
    this.showHideFlag[index] = !this.showHideFlag[index];
  }
  checkIFSC(event: any, index: number): void {
    const value = event.target.value.toUpperCase();
    const bankFormGroup = this.bankDetailsArray.at(index) as FormGroup;
    bankFormGroup.get('ifscCode')?.setValue(value, { emitEvent: false });
    if (value && value.length >= 6) {
      this.brockerDetailsService
        .getIfscOptions(value)
        .subscribe((response: any) => {
          if (response) {
            this.ifscCodeOptions[index] = response.$values;
            this.manageIFSCControl(index);
          }
        });
    }
  }
  manageIFSCControl(index: number): void {
    const arrayControl = this.brokerForm.controls['bankDetails'] as FormArray;
    this.ifscOptions[index] = arrayControl
      .at(index)
      .get('ifscCode')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => this.filterIFSC(value || '', index)),
      );
  }
  private filterIFSC(value: string, index: number): string[] {
    const filterValue = value.toLowerCase();
    if (!this.ifscCodeOptions[index]) {
      return [];
    }
    return this.ifscCodeOptions[index].filter((option: any) => {
      return option.toLowerCase().includes(filterValue);
    });
  }
  getBankInfo(event: any, index: number): void {
    if (event.option) {
      const bankFormGroup = this.bankDetailsArray.at(index) as FormGroup;
      this.brockerDetailsService
        .getBankInfo(event.option.value)
        .subscribe((res: any) => {
          if (res) {
            bankFormGroup.patchValue({
              branchName: res.branchName,
              micr: res.micrcode,
              bankName: res.bankId,
            });
          }
        });
    }
  }
  checkBankDetails(index: number): void {
    const bankFormGroup = this.bankDetailsArray.at(index) as FormGroup;
    const bankAccount = bankFormGroup.get('bankAccount')?.value;
    const ifscCode = bankFormGroup.get('ifscCode')?.value;
    const brokerName = this.brokerForm.get('brokerName')?.value;
    if (bankAccount && ifscCode && brokerName) {
      const reqObj = {
        beneficiaryAccount: bankFormGroup.get('bankAccount')?.value,
        beneficiaryName: this.brokerForm.get('brokerName')?.value,
        beneficiaryIFSC: bankFormGroup.get('ifscCode')?.value,
        nameFuzzy: true,
      };
      this.brockerDetailsService
        .VerifyBankDetails(reqObj)
        .subscribe((data: any) => {
          if (data.success === true) {
            this.penidropStatusFlag[index] = true;
            this.verifyAccFlag[index] = false;
            this.showSuccessIcon[index] = true;
            this.showFailIcon[index] = false;
            this.pennyDropFailure[index] = false;
            bankFormGroup.patchValue({ verificationStatus: 'Verified' });
          } else {
            this.penidropStatusFlag[index] = true;
            this.showFailIcon[index] = true;
            this.showSuccessIcon[index] = false;
            this.pennyDropFailure[index] = true;
            const errMsg =
              'Penny Drop Verification Failed. Please upload a cancelled Cheque Copy or Bank proof for Verifying the Bank Details';
            this.showError(errMsg);
          }
        });
    } else {
      this.showError(
        'Broker Name, Bank Account and IFSC Code are required for verification.',
      );
    }
  }
  addDematDetails(): void {
    if (this.dematDetailsArray.length < 5) {
      this.dematDetailsArray.push(this.createDematFormGroup(false));
    }
  }
  deletedDematDetails: any[] = [];
  removeDematDetails(index: number): void {
    const dematArray = this.brokerForm.get('dematDetails') as FormArray;
    const demat = dematArray.at(index).value;
    if (demat.dematId && demat.dematId !== 0) {
      this.deletedDematDetails.push({
        dematId: demat.dematId,
        depository: demat.depository,
        dematAccountNo: demat.dematAccount, // Map from form field name
        reEnterDematAccountNo: demat.reDematAccount, // Map from form field name
        isPrimary: demat.isPrimary || false,
        isVerified: demat.isVerified || demat.verificationStatus === 'Verified',
        isDemateDocUploded: demat.isDemateDocUploded || !!demat.demateFile,
        dematDocumentData: null,
        isDeleted: true,
      });
    }
    dematArray.removeAt(index);
  }
  checkDematNoMatch(index: number): void {
    const dematFormGroup = this.dematDetailsArray.at(index) as FormGroup;
    let dematAccount = dematFormGroup.get('dematAccount')?.value;
    let reDematAccount = dematFormGroup.get('reDematAccount')?.value;
    if (dematAccount) {
      dematAccount = dematAccount.toUpperCase();
      dematFormGroup.get('dematAccount')?.setValue(dematAccount);
      const isValid = /^[A-Z0-9]{16}$/.test(dematAccount);
      if (!isValid) {
        dematFormGroup.get('dematAccount')?.setErrors({
          invalidFormat: true,
        });
      }
    }
    if (reDematAccount) {
      reDematAccount = reDematAccount.toUpperCase();
      dematFormGroup.get('reDematAccount')?.setValue(reDematAccount);
    }
    if (dematAccount && reDematAccount) {
      if (dematAccount !== reDematAccount) {
        dematFormGroup
          .get('reDematAccount')
          ?.setErrors({ DemateaccountMismatch: true });
      } else {
        dematFormGroup.get('reDematAccount')?.setErrors(null);
      }
    }
  }
  verifyDemat(index: number): void {
    const dematFormGroup = this.dematDetailsArray.at(index) as FormGroup;
    const dematAccount = dematFormGroup.get('dematAccount')?.value;
    const depository = dematFormGroup.get('depository')?.value;
    if (dematAccount && depository) {
      dematFormGroup.patchValue({
        verificationStatus: 'Verified',
      });
    } else {
      this.showError(
        'Demat Account and Depository are required for verification.',
      );
    }
  }
  verifyPAN(): void {
    const pan = this.brokerForm.get('panNo')?.value;
    if (pan && pan.length === 10) {
      this.brokerForm.patchValue({
        brokerName: 'Auto-filled Broker Name',
        dob: '1990-01-01',
      });
    }
  }
  checkPanVerify(): void {
    const panControl = this.brokerForm.get('panNo');
    const dobControl = this.brokerForm.get('dob');
    const nameControl = this.brokerForm.get('brokerName');
    panControl?.markAsTouched();
    dobControl?.markAsTouched();
    nameControl?.markAsTouched();
    const panObj = {
      pan: panControl?.value,
      dob: moment(new Date(this.brokerForm.value.dob))
        .format('YYYY-MM-DD')
        .toString(),
      name: nameControl?.value,
      entityId: 1,
    };
    if (panControl?.valid && dobControl?.valid && nameControl?.valid) {
      this.brockerDetailsService.checkPan(panObj).subscribe((res: any) => {
        if (res.success === true) {
          this.panVerified = 'success';
          this.showVerificationIcon = true;
          this.makeFieldsDisable = true;
          this.showVerificationIconRed = false;
        } else {
          this.showVerificationIconRed = true;
          this.showVerificationIcon = false;
          this.makeFieldsDisable = false;
          this.panVerified = 'failed';
          const errMsg = res.message;
          this.panDedupeStatus = {};
          this.showError(errMsg);
        }
      });
    }
  }
  duplicatePan(): void {
    const formData = {
      pan: this.brokerForm.get('panNo')?.value,
      productId: 1,
      entityId: 1,
    };
    if (formData.pan && formData.productId && formData.entityId) {
      this.brockerDetailsService
        .checkDuplicatePan(formData)
        .subscribe((res: any) => {
          this.panDedupeStatus = res;
          if (!res.matchFound) {
            this.allowDedup = true;
          }
          if (res.matchFound) {
            this.openDuplicatePanDialog(res);
          }
        });
    }
  }
  openDuplicatePanDialog(res: any): void {
    const dialogRef = this.dialog.open(DuplicatePanComponent, {
      width: '350px',
      data: res,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.allowDedup = true;
      } else {
        this.allowDedup = false;
      }
    });
  }
  showError(errMsg: any): void {
    const dialogRef = this.dialog.open(CommonErrorDialogComponent, {
      width: '350px',
      data: {
        message: errMsg,
        flag: true,
      },
    });
  }
  onFileChange(event: any, fileType: string): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      switch (fileType) {
        case 'pan':
          this.panDocumentFile = files[0];
          this.panFileName = files[0].name;
          this.panDocumentRequired = false;
          break;
        case 'gst':
          this.gstDocumentFile = files[0];
          this.gstFileName = files[0].name;
          break;
        case 'others':
          this.otherDocumentFiles = Array.from(files);
          this.otherFileNames = this.otherDocumentFiles
            .map((f) => f.name)
            .join(', ');
          break;
      }
    }
  }
  onFileSelected(event: any, index: number): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.fileNames[index] = file.name;
      this.showFailIcon[index] = false;
      const bankDetailsArray = this.brokerForm.get('bankDetails') as FormArray;
      const bankFormGroup = bankDetailsArray.at(index) as FormGroup;
      bankFormGroup.patchValue({
        bankFile: file,
      });
      this.pennyDropFailure[index] = false;
      this.uploadDocument(index);
    }
  }
  onFileSelectedBankProof(event: any, index: number): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.bankFileProofNames = this.bankFileProofNames || [];
      this.bankFileProofNames[index] = file.name;
      this.bankFilesProof = this.bankFilesProof || [];
      this.bankFilesProof[index] = file;
      const bankDetailsArray = this.brokerForm.get('bankDetails') as FormArray;
      const dematFormGroup = bankDetailsArray.at(index) as FormGroup;
      dematFormGroup.patchValue({
        bankProofFileName: file.name,
        isBankProofDocUploded: true,
      });
      this.pennyDropFailure[index] = false;
    }
  }
  uploadDocument(index: number) {
    const bankDetailsArray = this.brokerForm.get('bankDetails') as FormArray;
    const bankFormGroup = bankDetailsArray.at(index) as FormGroup;
    const file: File = bankFormGroup.get('bankFile')?.value;
    this.showFailIcon[index] = false;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = (reader.result as string).split(',')[1];
      const payload = {
        documenttypeId: 1,
        documentfilename: file.name,
        documentfileextension: file.name.split('.').pop(),
        documentdata: base64Data,
        documentdownloadlink: '',
        isdeleted: false,
        brokerId: 0,
        brokerCode: this.brokerForm.get('brokerCode')?.value,
        documentType: 'Cheque Copy',
        documentId: 0,
      };
      this.brockerDetailsService.uploadDocumentPost(payload).subscribe(
        (uploadRes) => {
          const brokerCode = this.brokerForm.get('brokerCode')?.value;
          const signzyPayload = {
            type: 'cheque',
            email: 'admin@signzy.com',
            callbackUrl: 'https://your-domain.com/your-callback-system',
            images: [uploadRes.documentdownloadlink],
          };
          this.brockerDetailsService
            .sinzyUploadDoc(signzyPayload, brokerCode)
            .subscribe(
              (signzyRes) => {
                const extractPayload = {
                  documentType: 'cheque',
                  requestModel: {
                    service: 'Identity',
                    itemId: signzyRes?.itemid,
                    task: 'autoRecognition',
                    accessToken: signzyRes?.accesstoken,
                    essentials: {
                      url: signzyRes.url,
                    },
                  },
                };
                this.brockerDetailsService
                  .extractUploadDoc(extractPayload, brokerCode)
                  .subscribe(
                    (extractRes) => {
                      const bankFormGroup = this.bankDetailsArray.at(
                        index,
                      ) as FormGroup;
                      if (extractRes) {
                        bankFormGroup.patchValue({
                          bankAccount: extractRes.accountnumber,
                          reBankAccount: extractRes.accountnumber,
                          ifscCode: extractRes.ifsccode,
                          branchName: extractRes.branch,
                          micr: extractRes.micrCode,
                        });
                        const bankAcc = bankFormGroup.get('ifscCode')?.value;
                        this.brockerDetailsService
                          .getBankInfo(bankAcc)
                          .subscribe((res: any) => {
                            if (res) {
                              bankFormGroup.patchValue({
                                micr: res.micrcode,
                              });
                            }
                          });
                      }
                    },
                    (extractErr) => {},
                  );
              },
              (signzyErr) => {},
            );
        },
        (err) => {
          this.pennyDropFailure[index] = true;
        },
      );
    };
    reader.readAsDataURL(file);
  }
  onFileSelectedDemat(event: any, index: number): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.dematFileNames = this.dematFileNames || [];
      this.dematFileNames[index] = file.name;
      this.dematFiles = this.dematFiles || [];
      this.dematFiles[index] = file;
      const dematDetailsArray = this.brokerForm.get(
        'dematDetails',
      ) as FormArray;
      const dematFormGroup = dematDetailsArray.at(index) as FormGroup;
      dematFormGroup.patchValue({
        dematFileName: file.name,
        isDemateDocUploded: true,
      });
    }
  }
  Showmessage = false;
  message: string = '';
  tracWizzDocumentFile: File | null = null;
  async onSubmit(): Promise<void> {
    if (this.brokerForm.invalid) {
      this.demateDetailsSubmitted = true;
      this.bankDetailsSubmitted = true;
      this.panDetailsSubmitted = true;
      this.markFormGroupTouched(this.brokerForm);
      return;
    }
    const bankDetailsArray = this.brokerForm.get('bankDetails') as FormArray;
    for (let i = 0; i < bankDetailsArray.length; i++) {
      const bankGroup = bankDetailsArray.at(i) as FormGroup;
      const verificationStatus = bankGroup.get('verificationStatus')?.value;
      const bankFile = bankGroup.get('bankFile')?.value;
      const bankProofFile = this.bankFilesProof && this.bankFilesProof[i];
      const bankId = bankGroup.get('bankId')?.value;
      const isExistingBank = bankId && bankId !== 0;
      if (isExistingBank) {
        continue;
      }
      if (verificationStatus === 'Verified') {
        continue;
      }
      if (bankFile || bankProofFile) {
        continue;
      }
      this.pennyDropFailure[i] = true;
      this.showError(
        `Penny Drop Verification Failed. Please upload a cancelled Cheque Copy or Bank proof for Verifying the Bank Details`,
      );
      return;
    }
    try {
      const formValue = this.brokerForm.value;
      const panDocData = await this.createDocumentData(this.panDocumentFile, 1);
      const gstDocData = await this.createDocumentData(this.gstDocumentFile, 4);
      const otherDocData = await this.createDocumentData(
        this.otherDocumentFiles?.[0] || null,
        5,
      );
      const amlDocData = await this.createDocumentData(this.amlDocumentFile, 7);
      const tracWizzDocData = await this.createDocumentData(
        this.tracWizzDocumentFile,
        8,
      );
      const bankDetailsPromises = formValue.bankDetails.map(
        async (bank: any, index: number) => {
          let bankOCRDocData = null;
          if (bank.bankFile) {
            bankOCRDocData = await this.createDocumentData(bank.bankFile, 2);
          }
          let bankDocData = null;
          if (this.bankFilesProof && this.bankFilesProof[index]) {
            bankDocData = await this.createDocumentData(
              this.bankFilesProof[index],
              6,
            );
          }
          return {
            bankId: bank.bankId || 0,
            bankAccountNo: bank.bankAccount,
            reEnterBankAccountNo: bank.reBankAccount,
            ifsccode: bank.ifscCode,
            branchName: bank.branchName,
            micr: bank.micr,
            accountType: bank.accountType,
            isPrimary: bank.primaryAccount === true,
            isVerified: bank.isVerified || false,
            isBankDocUploded: !!(
              this.bankFilesProof && this.bankFilesProof[index]
            ),
            bankDocumentData: bankDocData,
            bankOCRDocumentData: bankOCRDocData,
            isDeleted: false,
          };
        },
      );
      const activeBanks = await Promise.all(bankDetailsPromises);
      const mappedDeletedBanks = (this.deletedBankDetails || []).map(
        (deletedBank) => ({
          bankId: deletedBank.bankId || 0,
          bankAccountNo: deletedBank.bankAccount || deletedBank.bankAccountNo,
          reEnterBankAccountNo:
            deletedBank.reBankAccount || deletedBank.reEnterBankAccountNo,
          ifsccode: deletedBank.ifscCode || deletedBank.ifsccode,
          branchName: deletedBank.branchName,
          micr: deletedBank.micr,
          accountType: deletedBank.accountType,
          isPrimary:
            deletedBank.primaryAccount || deletedBank.isPrimary || false,
          isVerified: deletedBank.isVerified || false,
          isBankDocUploded: deletedBank.isBankDocUploded || false,
          bankDocumentData: deletedBank.bankDocumentData || null,
          bankOCRDocumentData: deletedBank.bankOCRDocumentData || null,
          isDeleted: true,
        }),
      );
      const finalBankDetails = [...activeBanks, ...mappedDeletedBanks];
      const dematDetailsPromises = formValue.dematDetails.map(
        async (demat: any, index: number) => {
          let dematDocData = null;
          if (this.dematFiles && this.dematFiles[index]) {
            dematDocData = await this.createDocumentData(
              this.dematFiles[index],
              3,
            );
          }
          return {
            dematId: demat.dematId || 0,
            depository: demat.depository,
            dematAccountNo: demat.dematAccount,
            reEnterDematAccountNo: demat.reDematAccount,
            isPrimary: index === 0,
            isVerified: demat.isVerified || false,
            isDemateDocUploded: !!(this.dematFiles && this.dematFiles[index]),
            dematDocumentData: dematDocData,
            isDeleted: false,
          };
        },
      );
      const activeDematDetails = await Promise.all(dematDetailsPromises);
      const mappedDeletedDematDetails = (this.deletedDematDetails || []).map(
        (deletedDemat) => ({
          dematId: deletedDemat.dematId || 0,
          depository: deletedDemat.depository,
          dematAccountNo:
            deletedDemat.dematAccount || deletedDemat.dematAccountNo,
          reEnterDematAccountNo:
            deletedDemat.reDematAccount || deletedDemat.reEnterDematAccountNo,
          isPrimary: deletedDemat.isPrimary || false,
          isVerified: deletedDemat.isVerified || false,
          isDemateDocUploded: deletedDemat.isDemateDocUploded || false,
          dematDocumentData: deletedDemat.dematDocumentData || null,
          isDeleted: true,
        }),
      );
      const finalDematDetails = [
        ...activeDematDetails,
        ...mappedDeletedDematDetails,
      ];
      const activeContactDetails = formValue.contactDetails.map(
        (contact: any) => ({
          contactId: contact.contactId || 0,
          contactPersonName: contact.name,
          email: contact.email,
          mobileNo: contact.mobileNo,
          isDeleted: false,
        }),
      );
      const finalContactDetails = [
        ...activeContactDetails,
        ...(this.deletedContactDetails || []).map((deletedContact) => ({
          ...deletedContact,
          isDeleted: true,
        })),
      ];
      const requestData = {
        id: this.sharedService?.getLocalStorageData('counterBrokerID') || 0,
        brockerCode: formValue.brokerCode,
        firstName: formValue.brokerName,
        middleName: formValue.middleName || '',
        lastName: formValue.lastName || '',
        dob: new Date(formValue.dob).toISOString(),
        addressOne: formValue.address,
        addressTwo: formValue.address2 || '',
        gstno: formValue.gstNo || '',
        tanNo: formValue.tanNo || '',
        contactPersonName: formValue.contactDetails?.[0]?.name || '',
        email: formValue.contactDetails?.[0]?.email || '',
        mobile: formValue.contactDetails?.[0]?.mobileNo || '',
        isBrokerUpdated: true,
        isGstdocUploded: !!this.gstDocumentFile,
        isOtherDocUploded: !!this.otherDocumentFiles?.length,
        gstDocumentData: gstDocData,
        otherDocumentData: otherDocData,
        panDetail: {
          panno: formValue.panNo,
          dob: new Date(formValue.dob).toISOString(),
          isVerified: this.showVerificationIcon || false,
          isPanDocUploded: !!this.panDocumentFile,
          panDocumentData: panDocData,
        },
        bankDetails: finalBankDetails,
        dematDetails: finalDematDetails,
        contactDetails: finalContactDetails,
      };
      this.brockerDetailsService.brockerDetailsPost(requestData).subscribe({
        next: (response) => {
          if (response.success === true) {
            this.handleSuccessResponse(response);
          } else {
            this.showError(response.message || 'Failed to save broker details');
          }
        },
        error: (error) => {
          this.handleApiError(error);
        },
      });
    } catch (error) {
      this.showError('An unexpected error occurred while processing the form');
    }
  }
  private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }
  private handleSuccessResponse(response: any): void {
    this.resetForm();
    this.clearDeletedArrays();
    this.clearFileArrays();
    this.Showmessage = true;
    this.message = response.message || 'Broker details saved successfully';
  }
  private handleApiError(error: any): void {
    let errorMessage = 'Something went wrong while saving broker data';
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    this.showError(errorMessage);
  }
  private clearDeletedArrays(): void {
    this.deletedBankDetails = [];
    this.deletedDematDetails = [];
    this.deletedContactDetails = [];
  }
  private clearFileArrays(): void {
    this.fileNames = [];
    this.bankFileProofNames = [];
    this.dematFileNames = [];
    this.pennyDropFailure = [];
    this.showSuccessIcon = [];
    this.showFailIcon = [];
    this.showHideFlag = [];
    this.panDocumentFile = null;
    this.gstDocumentFile = null;
    this.otherDocumentFiles = [];
    this.bankFilesProof = []; // Bank proof files array
    this.dematFiles = []; // Demat files array
    this.panFileName = '';
    this.gstFileName = '';
    this.otherFileNames = '';
    this.panFileDocumentName = '';
    this.panFileDocumentPath = '';
    this.gstFileDocDownloadName = '';
    this.gstFileDownloadPath = '';
    this.otherFileDocDownloadName = '';
    this.otherFileDownloadPath = '';
  }
  private initializeFormArrays(): void {
    const contactArray = this.brokerForm.get('contactDetails') as FormArray;
    contactArray.clear();
    contactArray.push(this.createContactGroup());
    const bankArray = this.brokerForm.get('bankDetails') as FormArray;
    bankArray.clear();
    bankArray.push(this.createBankFormGroup());
    const dematArray = this.brokerForm.get('dematDetails') as FormArray;
    dematArray.clear();
    dematArray.push(this.createDematFormGroup());
  }
  closeDialog() {
    this.Showmessage = false;
    this.router.navigate(['/oms/view_counter_party']);
  }
  resetForm(): void {
    this.demateDetailsSubmitted = false;
    this.bankDetailsSubmitted = false;
    this.panDetailsSubmitted = false;
    this.brokerForm.reset();
    this.fileNames = [];
    this.dematFileNames = [];
    this.panDocumentFile = null;
    this.gstDocumentFile = null;
    this.otherDocumentFiles = [];
    this.dematFiles = [];
    this.otherFileNames = '';
    this.gstFileName = '';
    this.panFileName = '';
    this.showVerificationIcon = false;
    this.showVerificationIconRed = false;
    ((this.showSuccessIcon = []), (this.showFailIcon = []));
    this.initializeFormArrays();
    while (this.bankDetailsArray.length !== 0) {
      this.bankDetailsArray.removeAt(0);
    }
    this.bankDetailsArray.push(this.createBankFormGroup());
    this.makeFieldsDisable = false;
    while (this.dematDetailsArray.length !== 0) {
      this.dematDetailsArray.removeAt(0);
    }
    this.dematDetailsArray.push(this.createDematFormGroup());
    this.makeFieldsDisable = false;
  }
  async convertFileToBase64(file: File | null): Promise<string> {
    if (!file) {
      return '';
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let base64String = reader.result as string;
        base64String = base64String.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  }
  async createDocumentData(
    file: File | null,
    documentTypeId: number,
  ): Promise<any> {
    const documentData = {
      documenttypeId: documentTypeId,
      documentfilename: '',
      documentfileextension: '',
      documentdata: '',
      documentdownloadlink: '',
      isdeleted: false,
      brokerId: 0,
      brokerCode: this.brokerForm.get('brokerCode')?.value || '',
      documentType: this.getDocumentTypeFromId(documentTypeId),
      documentId: 0,
    };
    if (file) {
      const fileNameParts = file.name.split('.');
      const extension =
        fileNameParts.length > 1 ? fileNameParts.pop()?.toLowerCase() : '';
      const base64Data = await this.convertFileToBase64(file);
      documentData.documentfilename = file.name;
      documentData.documentfileextension = extension || '';
      documentData.documentdata = base64Data;
    }
    return documentData;
  }
  getDocumentTypeFromId(id: number): string {
    const types: { [key: number]: string } = {
      1: 'PAN',
      2: 'BANK',
      3: 'DEMAT',
      4: 'GST',
      5: 'OTHER',
      6: 'BANK PROOF',
    };
    return types[id] || 'UNKNOWN';
  }
  viewBankDoc(documentfilepath: string, documentfilename: string) {
    const docData = {
      documentfilepath,
      documentfilename,
    };
    const paylod = {
      documentName: documentfilename,
      documentFilePath: documentfilepath,
    };
    this.omsService.downloadDoc(paylod).subscribe((res: any) => {
      if (res) {
        this.saveAsBlob(res, docData.documentfilename);
      }
    });
  }
  viewDematDoc(dematDocumentFilePath: string, dematDocumentName: string) {
    const docData = {
      dematDocumentFilePath,
      dematDocumentName,
    };
    const paylod = {
      documentName: dematDocumentName,
      documentFilePath: dematDocumentFilePath,
    };
    this.omsService.downloadDoc(paylod).subscribe((res: any) => {
      if (res) {
        this.saveAsBlob(res, docData.dematDocumentName);
      }
    });
  }
  viewGstDoc(gstDocumentFilePath: string, gstDocumentName: string): void {
    const paylod = {
      documentName: gstDocumentName,
      documentFilePath: gstDocumentFilePath,
    };
    if (!gstDocumentFilePath || !gstDocumentName) {
      return;
    }
    this.omsService.downloadDoc(paylod).subscribe((res: any) => {
      this.saveAsBlob(res, gstDocumentName);
    });
  }
  viewOthersDoc(
    otherDocumentFilePath: string,
    otherDocumentName: string,
  ): void {
    const paylod = {
      documentName: otherDocumentName,
      documentFilePath: otherDocumentFilePath,
    };
    if (!otherDocumentFilePath || !otherDocumentName) {
      return;
    }
    this.omsService.downloadDoc(paylod).subscribe((res: any) => {
      this.saveAsBlob(res, otherDocumentName);
    });
  }
  viewPanDoc(): void {
    const paylod = {
      documentName: this.panFileDocumentName,
      documentFilePath: this.panFileDocumentPath,
    };
    if (!this.panFileDocumentPath || !this.panFileDocumentName) return;
    this.omsService.downloadDoc(paylod).subscribe((res: any) => {
      this.saveAsBlob(res, this.panFileDocumentName);
    });
  }
  saveAsBlob(data: Blob, fileName: string) {
    const blob = new Blob([data], { type: data.type });
    const file = new File([blob], fileName, { type: data.type });
    saveAs(file);
  }
}
