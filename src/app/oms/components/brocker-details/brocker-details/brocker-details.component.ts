import {
  Component,
  ViewChild,
  OnInit,
  HostListener,
  ElementRef,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ClientmasterService } from 'src/app/service/clientmaster.service';
import { CommonErrorDialogComponent } from 'src/app/shared/components/common-error-dialog/common-error-dialog.component';
import { DuplicatePanComponent } from 'src/app/components/duplicate-pan/duplicate-pan.component';
import * as moment from 'moment';
import { DeleteConfirmationDialogComponentComponent } from 'src/app/components/delete-confirmation-dialog-component/delete-confirmation-dialog-component/delete-confirmation-dialog-component.component';
import { PanVerifyDecryptedService } from 'src/app/oms/oms_services/panVerify_decrypted/pan-verify-decrypted.service';
import { BrockerDetailsService } from 'src/app/oms/oms_services/brocker_details/brocker-details.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-brocker-details',
  templateUrl: './brocker-details.component.html',
  styleUrls: ['./brocker-details.component.css'],
})
export class BrockerDetailsComponent implements OnInit {
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
  ifscCodeOptions: any[] = [];
  ifscOptions: Observable<any>[] = [];
  allDropdownOptions: any[] = [];
  bankDropdownOption: any[] = [];
  bankAccountTypeOptions: any[] = [];
  bankNameOptions: any[] = [];
  fileNames: string[] = [];
  dematFileNames: string[] = [];
  bankFileProofNames: string[] = [];
  panDocumentFile: File | null = null;
  gstDocumentFile: File | null = null;
  otherDocumentFiles: File[] = [];
  gstFileName: string = '';
  panFileName: string = '';
  otherFileNames: string = '';
  dematFiles: File[] = [];
  bankFilesProof: File[] = [];
  Showmessage = false;
  message: string = '';
  showHideFlag: any[] = [true, true, true, true, true];
  constructor(
    private fb: FormBuilder,
    private brockerDetailsService: BrockerDetailsService,
    private clientService: ClientmasterService,
    private dialog: MatDialog,
    private panVerifyService: PanVerifyDecryptedService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.initializeForm();
    this.getBrokerCode();
    this.loadDropdownOptions();
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
  createBankFormGroup(): FormGroup {
    return this.fb.group({
      bankAccount: ['', [Validators.required, this.checkDuplicateAccNo()]],
      reBankAccount: ['', Validators.required],
      ifscCode: ['', [Validators.required]],
      branchName: ['', Validators.required],
      micr: ['', Validators.required],
      accountType: ['', Validators.required],
      bankName: [''],
      verificationStatus: ['Not Verified'],
      bankFile: [null],
      primaryAccount: [false],
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
  createDematFormGroup(): FormGroup {
    return this.fb.group({
      depository: ['', [Validators.required, this.noWhitespaceValidator()]],
      dematAccount: ['', []],
      reDematAccount: [''],
      verificationStatus: ['Not Verified'],
      demateFile: [null],
      isDemateDocUploded: [false],
      dematFileName: [''],
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
  getBrokerCode(): void {
    this.brockerDetailsService.getBrockerCode().subscribe((response: any) => {
      if (response?.brokerCode) {
        this.brokerForm.patchValue({ brokerCode: response.brokerCode });
      }
    });
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
      this.bankDetailsArray.push(this.createBankFormGroup());
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
    return -1; // No primary account found
  }
  onPrimaryAccountChange(index: number, event: any): void {
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
  deleteContactDetails(index: any): void {
    const dialogRef = this.dialog.open(
      DeleteConfirmationDialogComponentComponent,
      {
        width: '350px',
        data: {
          message: 'Are you sure you want to delete this contact details ?',
        },
      },
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.removeContact(index);
      } else {
      }
    });
  }
  removeBankDetails(index: number): void {
    if (this.bankDetailsArray.length > 1) {
      this.bankDetailsArray.removeAt(index);
      this.fileNames.splice(index, 1);
      this.pennyDropFailure.splice(index, 1);
    }
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
      this.dematDetailsArray.push(this.createDematFormGroup());
    }
  }
  removeDematDetails(index: number): void {
    if (this.dematDetailsArray.length > 1) {
      this.dematDetailsArray.removeAt(index);
    }
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
  amlResponse: any = null;
  amlRequired: boolean = false;
  amlDocumentFile: File | null = null;
  amlDocumentBase64: string | null = null;
  amlVerified: boolean = false;
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
          this.amlRequired = !res.isAmlProceed;
          this.brokerForm.patchValue({
            amlStatus: res?.status,
          });
          this.amlVerified = true;
        });
    }
  }
  amlFileName: string | null = null;
  fileChangeEvent(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.amlDocumentFile = file;
      this.amlFileName = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        this.amlDocumentBase64 = (reader.result as string).split(',')[1]; // Base64 only
      };
      reader.readAsDataURL(file);
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
  async onSubmit(): Promise<void> {
    if (this.brokerForm.invalid) {
      this.demateDetailsSubmitted = true;
      this.bankDetailsSubmitted = true;
      this.panDetailsSubmitted = true;
      return;
    }
    let hasDocumentError = false;
    if (!this.panDocumentFile) {
      this.panDocumentRequired = true;
      hasDocumentError = true;
      this.showError('PAN Document is required.');
    }
    if (hasDocumentError) {
      return;
    }
    if (this.panVerified !== 'success') {
      this.showError('PAN verification is required before submission.');
      return;
    }
    if (!this.amlVerified) {
      this.showError('AML verification is required before submission.');
      return;
    }
    if (this.amlResponse && this.amlResponse.isAmlProceed === false) {
      if (!this.amlDocumentBase64) {
        this.showError('AML supporting document is required.');
        return;
      }
    }
    const bankDetailsArray = this.brokerForm.get('bankDetails') as FormArray;
    for (let i = 0; i < bankDetailsArray.length; i++) {
      const bankGroup = bankDetailsArray.at(i) as FormGroup;
      const verificationStatus = bankGroup.get('verificationStatus')?.value;
      const bankFile = bankGroup.get('bankFile')?.value;
      const bankProofFile = this.bankFilesProof && this.bankFilesProof[i];
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
      return; // Stop form submission
    }
    try {
      const formValue = this.brokerForm.value;
      const panDocData = await this.createDocumentData(this.panDocumentFile, 1);
      const gstDocData = await this.createDocumentData(this.gstDocumentFile, 4);
      const otherDocData = await this.createDocumentData(
        this.otherDocumentFiles && this.otherDocumentFiles.length > 0
          ? this.otherDocumentFiles[0]
          : null,
        5,
      );
      let amlDocData = null;
      if (this.amlDocumentBase64) {
        amlDocData = {
          documenttypeId: 7, // set AML typeId from your master
          documentfilename: this.amlDocumentFile?.name,
          documentfileextension: this.amlDocumentFile?.name.split('.').pop(),
          documentdata: this.amlDocumentBase64,
          isdeleted: false,
        };
      }
      let tracWizzDocData = null;
      if (this.amlResponse?.reportFileBytes) {
        tracWizzDocData = {
          documenttypeId: 8, // tracwizz typeId
          documentfilename: 'AML_Report', // or dynamic
          documentfileextension: '',
          documentdata: this.amlResponse.reportFileBytes,
          isdeleted: false,
        };
      }
      const bankDetailsPromises = formValue.bankDetails.map(
        async (bank: any, index: number) => {
          const bankOCRDocData = await this.createDocumentData(
            bank.bankFile,
            2,
          );
          const bankProofDocData = await this.createDocumentData(
            this.bankFilesProof && this.bankFilesProof[index]
              ? this.bankFilesProof[index]
              : null,
            6, // Using same document type as bank OCR
          );
          return {
            bankAccountNo: bank.bankAccount,
            reEnterBankAccountNo: bank.reBankAccount,
            ifsccode: bank.ifscCode,
            branchName: bank.branchName,
            micr: bank.micr,
            accountType: bank.accountType,
            isPrimary: bank.primaryAccount === true,
            isdeleted: false,
            isVerified: bank.verificationStatus === 'Verified',
            isBankDocUploded: !!(
              bank.bankFile ||
              (this.bankFilesProof && this.bankFilesProof[index])
            ),
            bankOCRDocumentData: bankOCRDocData,
            bankDocumentData: bankProofDocData, // This maps to the Swagger payload
          };
        },
      );
      const bankDetails = await Promise.all(bankDetailsPromises);
      const dematDetailsPromises = formValue.dematDetails.map(
        async (demat: any, index: number) => {
          const dematFile = this.dematFiles && this.dematFiles[index];
          const dematDocData = await this.createDocumentData(dematFile, 3);
          return {
            depository: demat.depository,
            dematAccountNo: demat.dematAccount,
            reEnterDematAccountNo: demat.reDematAccount,
            isPrimary: index === 0,
            isVerified: demat.verificationStatus === 'Verified',
            isDemateDocUploded: !!dematFile,
            dematDocumentData: dematDocData,
            isdeleted: false,
          };
        },
      );
      const dematDetails = await Promise.all(dematDetailsPromises);
      const requestData = {
        id: 0,
        brockerCode: formValue.brokerCode,
        firstName: formValue.brokerName,
        middleName: formValue.middleName,
        lastName: formValue.lastName,
        dob: new Date(formValue.dob).toISOString(),
        isAmlProceed: this.amlResponse?.isAmlProceed ?? true,
        amlStatus: this.amlResponse?.status ?? 'Pending',
        amlHitCount: this.amlResponse?.hitCount ?? 0,
        isAmlDocumentReceived: !!this.amlDocumentBase64,
        amlDocument: amlDocData,
        tracWizzDocument: tracWizzDocData,
        addressOne: formValue.address,
        addressTwo: formValue.address2,
        gstno: formValue.gstNo,
        tanNo: formValue.tanNo,
        isGstdocUploded: !!this.gstDocumentFile,
        isOtherDocUploded: !!(
          this.otherDocumentFiles && this.otherDocumentFiles.length > 0
        ),
        gstDocumentData: gstDocData,
        otherDocumentData: otherDocData,
        panDetail: {
          panno: formValue.panNo,
          dob: new Date(formValue.dob).toISOString(),
          isVerified: true,
          isPanDocUploded: !!this.panDocumentFile,
          panDocumentData: panDocData,
        },
        contactDetails: formValue.contactDetails.map((c: any) => ({
          contactPersonName: c.name,
          email: c.email,
          mobileNo: c.mobileNo,
        })),
        bankDetails: bankDetails,
        dematDetails: dematDetails,
      };
      this.brockerDetailsService.brockerDetailsPost(requestData).subscribe(
        (response) => {
          if (response.success === true) {
            const mailPayload = {
              counterPartyCode: formValue.brokerCode,
              notificationType: 'TransactionExecutionForChecker',
              isBankUpdated: false,
              isDematUpdated: false,
            };
            this.resetForm();
            this.getBrokerCode();
            ((this.Showmessage = true), (this.message = response.message));
          }
          if (response.success === false) {
            const errMsg = response.message;
            this.showError(errMsg);
          }
        },
        (error) => {},
      );
    } catch (error) {}
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
}
