import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/service/shared.service';
import { map, Observable, startWith } from 'rxjs';
import { Router } from '@angular/router';
import { BrokerUnlistedService } from 'src/app/oms/oms_services/broker_unlisted/broker-unlisted.service';
import { StockInwardService } from 'src/app/oms/oms_services/stock_inward/stock-inward.service';
import { PlaceOrderService } from 'src/app/oms/oms_services/place-order/place-order.service';
@Component({
  selector: 'app-brocker-order-unlisted',
  templateUrl: './brocker-order-unlisted.component.html',
  styleUrls: ['./brocker-order-unlisted.component.css'],
})
export class BrockerOrderUnlistedComponent {
  showHideClientDetails: boolean = false;
  showHideBank: boolean = false;
  showHideDp: boolean = false;
  dpData: any[] = [];
  bankData: any[] = [];
  bankAccountNoStore: any;
  demateNoStore: any;
  viewData: any[] = [];
  placeOrderData: any;
  placeOrderDataViewData: any;
  bankDetails: any;
  dematDetails: any;
  orderEntryForm!: FormGroup;
  blockDownsellForm!: FormGroup;
  selectClientType: any;
  selectedOrderType = 'UNLISTED EQ';
  isinSecurityData: any = [];
  isinToDataMap: { [key: string]: any } = {};
  securityToDataMap: { [key: string]: any } = {};
  isinOptionss!: Observable<any[]>;
  securityOptions!: Observable<any[]>;
  freequantity: number = 0;
  orderDetailsSubmitted: boolean = false;
  unlistedTradeTypeSubmitted: boolean = false;
  unlistedQuantityValue: any;
  flowPrice: any = 0;
  floorPriceData: any;
  unlistedPrice: any = '';
  lobData: any[] = [];
  filteredLobData$!: Observable<any[]>;
  showDoneButton = false;
  showConfirmOrderDialog: boolean = false;
  showConfirmDialogOrder: boolean = false;
  cartData: any;
  showHideViewCart: boolean = false;
  showConfirmDialogOrderPopUp: boolean = false;
  showConfirmDialog: boolean = false;
  itemIdToDelete: any = null;
  itemOrderType: any = null;
  showConfirmDialogViewOrder: boolean = false;
  filteredEntities!: Observable<any[]>;
  filteredTranche!: Observable<any[]>;
  buyingEntityData: any;
  selectedEntityData: any;
  trancheNameData: any;
  selectedTrancheData: any;
  constructor(
    private stockinewardService: StockInwardService,
    private router: Router,
    private fb: FormBuilder,
    private sharedService: SharedService,
    private BrokerUnlistedService: BrokerUnlistedService,
    private placeOrderService: PlaceOrderService,
  ) {}
  ngOnInit() {
    ((this.selectClientType =
      this.sharedService.getLocalStorageData('clientType')),
      this.createBlockForm());
    this.getcustomTebleData();
    this.getPlaceOrder();
    this.getBuyingEntityData();
    this.blockDownsellForm = this.fb.group({
      transactionType: ['BLOCK_DOWNSELL'],
      scripName: ['', Validators.required],
      isinCode: ['', Validators.required],
      broker: [''],
      blockedQty: [''],
      blockedPrice: [''],
      availableQty: [''],
      orderQty: [''],
      orderPrice: [''],
      taxType: ['NA'],
      stampDuty: [''],
      taxAmount: [''],
      totalConsideration: [''],
      marginPercent: [''],
      marginPayable: [''],
    });
  }
  createBlockForm() {
    this.orderEntryForm = this.fb.group({
      transactionType: ['BLOCK'],
      scripName: ['', Validators.required],
      isinCode: ['', Validators.required],
      availableQty: [''],
      blockQty: ['', [Validators.required, this.priceMultipleValidator()]],
      floorPrice: [''],
      blockPrice: ['', [Validators.required, this.priceAboveFloorValidator()]],
      lob: ['', Validators.required],
      buyingEntity: ['', Validators.required],
      trancheName: ['', Validators.required],
    });
  }
  trancheDropDown() {
    const payload = {
      isian: this.orderEntryForm?.value?.isinCode,
      entityId: this.selectedEntityData?.entityId,
      lob: this.orderEntryForm?.value?.lob,
      qty: 0,
      clientCode: this.placeOrderData?.clientCode,
    };
    this.placeOrderService.getTrancheName(payload).subscribe((res: any) => {
      this.trancheNameData = res?.$values;
      this.initializeTrancheFilter();
    });
  }
  initializeTrancheFilter(): void {
    this.filteredTranche = this.orderEntryForm.controls[
      'trancheName'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => this._filterTranche(value || '')),
    );
  }
  private _filterTranche(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.trancheNameData.filter((option: any) =>
      option.trancheName?.toLowerCase().includes(filterValue),
    );
  }
  onTrancheSelected(trancheName: string): void {
    const selectedTranche = this.trancheNameData?.find(
      (option: any) => option?.trancheName === trancheName,
    );
    this.selectedTrancheData = selectedTranche;
    const payload = {
      isian: this.orderEntryForm?.value?.isinCode,
      lob: this.orderEntryForm?.value?.lob,
      qty: 0,
      entityId: this.selectedEntityData.entityId,
      tranchId: this.selectedTrancheData?.trancheId,
    };
    this.BrokerUnlistedService.getUnlistedQuantity(payload).subscribe(
      (res: any) => {
        this.freequantity = res.availableQty;
        const formatAvailQty = this.formatIndianNumber(res?.availableQty);
        this.orderEntryForm.patchValue({
          availableQty: res.availableQty,
        });
      },
    );
  }
  lobDropdownData(): void {
    this.BrokerUnlistedService.getLobData(
      this.orderEntryForm.value?.isinCode,
      this.selectedEntityData.entityId,
    ).subscribe((res: any) => {
      this.lobData = res?.$values || [];
    });
  }
  private _filterLob(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.lobData.filter((option) =>
      option.name.toLowerCase().includes(filterValue),
    );
  }
  enableDisableHideClientDetails(check: string) {
    if (check == 'open') {
      this.showHideClientDetails = true;
      this.getViewData();
    } else if (check == 'close') {
      this.showHideClientDetails = false;
    }
  }
  getViewData() {
    const payload: any = {
      brokerCode: this.sharedService.getLocalStorageData('brokerCode'),
      bankAccountNo: '',
      dematAccountNo: '',
    };
    this.BrokerUnlistedService.getPlaceOrderData(payload).subscribe(
      (res: any) => {
        this.placeOrderDataViewData = res;
      },
    );
  }
  getFormattedPAN(pan: string): string {
    if (!pan || pan.length !== 10) {
      return pan;
    }
    return 'XXXXX' + pan.substr(5);
  }
  getFormattedMobile(mobile: any): string {
    if (!mobile || mobile.length !== 10) {
      return mobile;
    }
    return 'XXXXX' + mobile.substr(5);
  }
  getFormattedEmail(email: string): string {
    if (!email) return '';
    const atIndex = email.indexOf('@');
    const localPart = email.slice(0, atIndex);
    const domainPart = email.slice(atIndex);
    const formattedLocalPart =
      localPart[0] +
      'X'.repeat(localPart.length - 2) +
      localPart[localPart.length - 1];
    return formattedLocalPart + domainPart;
  }
  maskBankAccount(bankAccountNo: string | null | undefined): string {
    if (!bankAccountNo) {
      return '';
    }
    const visibleDigits = 4;
    const maskedPart = 'X'.repeat(bankAccountNo.length - visibleDigits);
    const visiblePart = bankAccountNo.slice(-visibleDigits);
    return `${maskedPart}${visiblePart}`;
  }
  enableDisableBankDet(check: string) {
    if (check == 'openBank') {
      this.showHideBank = true;
      this.getBankData();
    } else if (check == 'closeBank') {
      this.showHideBank = false;
      this.postBankId();
    }
  }
  postBankId() {
    this.BrokerUnlistedService.postBankAccountno(
      this.bankAccountNoStore,
    ).subscribe((res: any) => {
      if (res) {
        const payload: any = {
          brokerCode: this.sharedService.getLocalStorageData('brokerCode'),
          bankAccountNo: this.bankAccountNoStore || '',
          dematAccountNo: '',
        };
        this.BrokerUnlistedService.getPlaceOrderData(payload).subscribe(
          (res: any) => {
            this.placeOrderData = res;
            this.bankDetails = {
              bankAccountNo: res.bankAccountNo,
              clientId: res.clientId,
              ifscCode: res.ifscCode,
              isPrimaryOfBankAccount: res.isPrimaryOfBankAccount,
              bankPOA: res.bankPOA,
            };
            this.dematDetails = {
              dematAccountNo: res.dematAccountNo,
              isPrimaryOfDematAccount: res.isPrimaryOfDematAccount,
              dppoa: res.dppoa,
              dpClientid: res.dpClientid,
            };
            this.placeOrderData.bankId;
            this.placeOrderData.dpUniqueId;
            this.sharedService.addLocalStoragData(
              'selectedBankId',
              this.placeOrderData.bankId,
            );
            this.sharedService.addLocalStoragData(
              'dpId',
              this.placeOrderData.dpUniqueId,
            );
          },
        );
      }
    });
  }
  getPlaceOrder() {
    const payload: any = {
      brokerCode: this.sharedService.getLocalStorageData('brokerCode'),
      bankAccountNo: this.bankAccountNoStore || '',
      dematAccountNo: '',
    };
    this.BrokerUnlistedService.getPlaceOrderData(payload).subscribe(
      (res: any) => {
        this.placeOrderData = res;
        this.bankDetails = {
          bankAccountNo: res.bankAccountNo,
          clientId: res.clientId,
          ifscCode: res.ifscCode,
          isPrimaryOfBankAccount: res.isPrimaryOfBankAccount,
          bankPOA: res.bankPOA,
        };
        this.dematDetails = {
          dematAccountNo: res.dematAccountNo,
          isPrimaryOfDematAccount: res.isPrimaryOfDematAccount,
          dppoa: res.dppoa,
          dpClientid: res.dpClientid,
        };
        this.placeOrderData.bankId;
        this.placeOrderData.dpUniqueId;
        this.sharedService.addLocalStoragData(
          'selectedBankId',
          this.placeOrderData.bankId,
        );
        this.sharedService.addLocalStoragData(
          'dpId',
          this.placeOrderData.dpUniqueId,
        );
        this.showCartData();
      },
    );
  }
  getBankData() {
    const brockerCode = this.sharedService.getLocalStorageData('brokerCode');
    this.BrokerUnlistedService.getBankDet(brockerCode).subscribe((res: any) => {
      this.bankData = res.$values;
      if (this.bankData.length > 0) {
        this.selectBank(this.bankData[0].bankAccountNo);
      }
    });
  }
  selectBank(bankAccountNo: number) {
    this.bankAccountNoStore = bankAccountNo;
  }
  selectDp(dematAccountNo: number) {
    this.demateNoStore = dematAccountNo;
    this.sharedService.addLocalStoragData('dpId', this.demateNoStore);
  }
  enableDisableDp(check: string) {
    if (check == 'openDp') {
      this.showHideDp = true;
      this.getDpData();
    } else if (check == 'closeDp') {
      this.showHideDp = false;
      this.postDpId();
    }
  }
  getDpData() {
    const brockerCode = this.sharedService.getLocalStorageData('brokerCode');
    this.BrokerUnlistedService.getDpData(brockerCode).subscribe((res: any) => {
      this.dpData = res.$values;
    });
  }
  postDpId() {
    const payload: any = {
      brokerCode: this.sharedService.getLocalStorageData('brokerCode'),
      bankAccountNo: this.bankAccountNoStore || '',
      dematAccountNo: this.demateNoStore || '',
    };
    this.BrokerUnlistedService.getPlaceOrderData(payload).subscribe(
      (res: any) => {
        this.placeOrderData = res;
        this.bankDetails = {
          bankAccountNo: res.bankAccountNo,
          clientId: res.clientId,
          ifscCode: res.ifscCode,
          isPrimaryOfBankAccount: res.isPrimaryOfBankAccount,
          bankPOA: res.bankPOA,
        };
        this.dematDetails = {
          dematAccountNo: res.dematAccountNo,
          isPrimaryOfDematAccount: res.isPrimaryOfDematAccount,
          dppoa: res.dppoa,
          dpClientid: res.dpClientid,
        };
        this.placeOrderData.bankId;
        this.placeOrderData.dpUniqueId;
        this.sharedService.addLocalStoragData(
          'selectedBankId',
          this.placeOrderData.bankId,
        );
        this.sharedService.addLocalStoragData(
          'dpId',
          this.placeOrderData.dpUniqueId,
        );
      },
    );
  }
  getcustomTebleData() {
    const ordertype = 'UNLISTED EQ';
    this.BrokerUnlistedService.getcustomTebleData(ordertype).subscribe(
      (res: any) => {
        this.isinSecurityData = res.$values;
        this.isinSecurityData.forEach(
          (item: { isin: string | number; companyName: string | number }) => {
            this.isinToDataMap[item.isin] = item;
            this.securityToDataMap[item.companyName] = item;
          },
        );
        this.isinOptionss = this.orderEntryForm.controls[
          'isinCode'
        ].valueChanges.pipe(
          startWith(''),
          map((value) => this._filter(value || '')),
        );
        this.securityOptions = this.orderEntryForm.controls[
          'scripName'
        ].valueChanges.pipe(
          startWith(''),
          map((value) => this.securityFilter(value || '')),
        );
      },
    );
  }
  checkUnlistedIsinCode(event: any) {
    const selectedIsin = event.option.value;
    const selectedData = this.isinSecurityData.find(
      (data: any) => data.companyName === selectedIsin,
    );
    if (selectedData) {
      this.orderEntryForm.get('scripName')?.setValue(selectedData.companyName);
    }
    this.isinSecurityData.filter((data: any) => {
      if (data.companyName == event.option.value) {
        this.orderEntryForm.get('isinCode')?.setValue(data.isin);
      }
    });
  }
  checkUnlistedSecurityName(event: any) {
    const selectedIsin = event.option.value;
    const selectedData = this.isinSecurityData.find(
      (data: any) => data.isin === selectedIsin,
    );
    if (selectedData) {
      this.orderEntryForm.get('scripName')?.setValue(selectedData.isin);
    }
    this.isinSecurityData.filter((data: any) => {
      if (data.isin == event.option.value) {
        this.orderEntryForm.get('scripName')?.setValue(data.companyName);
      }
    });
  }
  clickLob(event: any) {
    const selectedLob = event.value;
    this.trancheDropDown();
  }
  private _filter(value: any): any[] {
    const filterValue = value?.toLowerCase();
    return this.isinSecurityData.filter((option: any) => {
      return option.isin?.toLowerCase().includes(filterValue);
    });
  }
  private securityFilter(value: any): any[] {
    const filterValue = value?.toLowerCase();
    return this.isinSecurityData.filter((option: any) => {
      return option.companyName?.toLowerCase().includes(filterValue);
    });
  }
  unlistedQtyformatInput() {
    let rawValue = this.unlistedQuantityValue.replace(/,/g, '');
    this.unlistedQuantityValue = this.addCommas(rawValue);
    const quantity = parseFloat(rawValue);
    if (!isNaN(quantity)) {
      const tradeType = this.orderEntryForm?.value?.tradeType;
      const payload = {
        isian: this.orderEntryForm?.value?.isinCode,
        lob: this.orderEntryForm?.value?.lob,
        qty: Number(
          this.orderEntryForm.value.blockQty.toString().replace(/,/g, ''),
        ),
        entityId: this.selectedEntityData?.entityId,
        tranchId: this.selectedTrancheData?.trancheId,
      };
      this.BrokerUnlistedService.getFloorPrice(payload).subscribe(
        (res: any) => {
          this.floorPriceData = res;
          this.flowPrice = res?.floorPrice;
          const formattedPrice = this.formatIndianNumber(res?.floorPrice);
          this.orderEntryForm.patchValue({
            floorPrice: formattedPrice,
          });
        },
      );
    }
  }
  unlistedPriceformatInput() {
    let formattedValue = this.unlistedPrice?.replace(/,/g, '');
    formattedValue = this.addCommas(formattedValue);
    this.unlistedPrice = formattedValue;
  }
  onKeyPressComma(event: KeyboardEvent) {
    const charCode = event.which || event.keyCode;
    const charTyped = String.fromCharCode(charCode);
    if (!/^[\d.]$/.test(charTyped)) {
      event.preventDefault();
      return;
    }
    const input = event.target as HTMLInputElement;
    const inputValue = input.value;
    const selectionStart = input.selectionStart || 0;
    const selectionEnd = input.selectionEnd || 0;
    const newValue =
      inputValue.substring(0, selectionStart) +
      charTyped +
      inputValue.substring(selectionEnd);
    const [beforeDecimal, afterDecimal] = newValue.split('.');
    if (charTyped === '.' && inputValue.includes('.')) {
      event.preventDefault();
      return;
    }
    if (beforeDecimal && beforeDecimal.length > 23) {
      event.preventDefault();
      return;
    }
    if (afterDecimal && afterDecimal.length > 2) {
      event.preventDefault();
    }
  }
  priceMultipleValidator(): any {
    return (control: any): any => {
      let inputPrice = control.value;
      if (typeof inputPrice === 'string') {
        inputPrice = parseFloat(inputPrice.replace(/,/g, ''));
      }
      const multipleOf = this.floorPriceData?.multipuleOff;
      if (!multipleOf || isNaN(inputPrice)) return null;
      return inputPrice % multipleOf === 0 ? null : { notMultiple: true };
    };
  }
  priceAboveFloorValidator(): any {
    return (control: any): any => {
      let inputPrice = control.value;
      if (typeof inputPrice === 'string') {
        inputPrice = parseFloat(inputPrice.replace(/,/g, ''));
      }
      return inputPrice >= this.flowPrice ? null : { belowFloorPrice: true };
    };
  }
  formatIndianNumber(value: number | string): string {
    const [integer, decimal] = value.toString().split('.');
    let lastThree = integer.slice(-3);
    const otherNumbers = integer.slice(0, -3);
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
    const formattedInteger =
      otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
    return decimal ? `${formattedInteger}.${decimal}` : formattedInteger;
  }
  addCommas(nStr: string) {
    nStr = nStr?.toString()?.replace(/₹/g, '');
    let x = nStr?.split('.');
    let x1 = x[0];
    let x2 = x?.length > 1 ? '.' + x[1] : '';
    let lastThree = x1?.substring(x1.length - 3);
    let otherNumbers = x1?.substring(0, x1.length - 3);
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
    let rgx = /(\d+)(\d{2})/;
    while (rgx.test(otherNumbers)) {
      otherNumbers = otherNumbers.replace(rgx, '$1' + ',' + '$2');
    }
    x1 = otherNumbers + lastThree;
    let formattedValue = x1 + x2;
    return formattedValue;
  }
  onKeyPress(event: KeyboardEvent) {
    const charCode = event.which || event.keyCode;
    const charTyped = String.fromCharCode(charCode);
    if (!/^\d+$/.test(charTyped)) {
      event.preventDefault();
    }
  }
  resetUnlistedIsinSecurity() {
    this.orderEntryForm.get('scripName')?.reset();
    this.orderEntryForm.get('isinCode')?.reset();
    this.orderEntryForm.get('availableQty')?.reset();
    this.orderEntryForm.get('lob')?.reset();
    this.orderEntryForm.get('blockQty')?.reset();
    this.orderEntryForm.get('floorPrice')?.reset();
    this.orderEntryForm.get('blockPrice')?.reset();
    this.orderEntryForm.get('buyingEntity')?.reset();
    this.orderEntryForm.get('trancheName')?.reset();
    this.freequantity = 0;
    this.orderDetailsSubmitted = false;
    this.unlistedTradeTypeSubmitted = false;
  }
  postOrderBlock() {
    this.orderDetailsSubmitted = true;
    let formdata = {
      SchemeName: this.orderEntryForm.value.scripName,
      isincode: this.orderEntryForm.value.isinCode,
      lob: this.orderEntryForm.value.lob,
      availableQty: Number(
        this.orderEntryForm.value.availableQty.toString().replace(/,/g, ''),
      ),
      buyerEntityName: this.orderEntryForm.value.buyingEntity,
      tranchName: this.orderEntryForm?.value?.trancheName,
      tranchId: this.selectedTrancheData?.trancheId,
      buyerEntityId: this.selectedEntityData?.entityId,
      blockQty: Number(
        this.orderEntryForm.value.blockQty.toString().replace(/,/g, ''),
      ),
      floorPrice: Number(
        this.orderEntryForm.value.floorPrice.toString().replace(/,/g, ''),
      ),
      blockPrice: parseFloat(
        this.orderEntryForm.value.blockPrice.toString().replace(/,/g, ''),
      ),
      ordertype: 'BLOCK ORDER',
      brokerId: this.placeOrderData.brokerId,
      brokerName: this.placeOrderData.brokerName,
      bankAccountno: this.placeOrderData.bankAccountNo,
      ifsccode: this.placeOrderData.bankAccountNo,
      dematNo: this.placeOrderData.dematAccountNo,
      status: 'OPEN',
      makertimetamp: null,
      makerid: 0,
      entityid: 0,
      isactive: true,
      isdeleted: false,
      flowprice: this.flowPrice,
      tranchDetails: {
        subLob: this.floorPriceData?.subLob,
        floorPrice: this.floorPriceData?.floorPrice || 0,
        multipuleOff: this.floorPriceData?.multipuleOff || 0,
        tranchName: this.floorPriceData?.tranchName,
        tranchDetails:
          this.floorPriceData?.tranchDetails?.$values?.map((t: any) => ({
            $id: t.$id,
            tranchId: t.tranchId,
            allocationid: t.allocationid,
            qtyToBeOrderd: t.qtyToBeOrderd,
            floorPrice: t.floorPrice,
          })) || [],
      },
    };
    this.BrokerUnlistedService.postOrderType(formdata).subscribe((res: any) => {
      if (res) {
        this.showDoneButton = true;
        this.showCartData();
        this.orderDetailsSubmitted = false;
        this.unlistedTradeTypeSubmitted = false;
        this.orderEntryForm.reset();
        this.orderEntryForm.get('transactionType')?.setValue('BLOCK');
        this.freequantity = 0;
        this.flowPrice = 0;
        this.showConfirmOrderDialog = false;
      }
    });
  }
  SubmitConfirm(): void {
    this.postOrderBlock(); // Call your API
    this.showConfirmDialogOrder = false; // Close popup
  }
  onAddToCart(): void {
    this.orderDetailsSubmitted = true;
    if (this.orderEntryForm.valid) {
      this.showConfirmDialogOrder = true;
    }
  }
  showCartData() {
    let brokerId = this.placeOrderData?.brokerId;
    this.BrokerUnlistedService.getViewCartData(brokerId).subscribe(
      (res: any) => {
        this.cartData = res;
      },
    );
  }
  enableDisableViewCart(check: string) {
    if (check == 'openViewCart') {
      this.showHideViewCart = true;
      this.showCartData();
    } else if (check == 'CloseViewCart') {
      this.showHideViewCart = false;
    }
  }
  submitViewCartOrder() {
    this.showConfirmDialogOrderPopUp = true;
  }
  SubmitConfirmOrder(): void {
    this.submitViewOrder();
    this.showConfirmDialogOrderPopUp = false;
  }
  submitCancelOrder(): void {
    this.showConfirmDialogOrderPopUp = false;
  }
  onConfirm(): void {
    this.deleteCard(this.itemIdToDelete, this.itemOrderType);
    this.showConfirmDialog = false;
    this.itemIdToDelete = null;
    this.itemOrderType = null;
  }
  onCancel(): void {
    this.showConfirmDialog = false;
    this.itemIdToDelete = null;
    this.itemOrderType = null;
  }
  deleteCard(id: any, ordertype: any) {
    const requestPyload = {
      id: id,
      orderType: ordertype,
    };
    this.BrokerUnlistedService.deleteViewCartData(requestPyload).subscribe(
      (res: any) => {
        if (res) {
          this.showCartData();
        }
      },
    );
  }
  submitViewOrder() {
    const orderData = this.cartData;
    this.BrokerUnlistedService.postOrderData(orderData).subscribe(
      (response) => {
        this.router.navigateByUrl('/oms/block_dashboard');
      },
    );
  }
  formatToIndianNumberingDecimalNotShow(amount: number | null): string {
    if (amount == null) return '-';
    const numberValue = amount.toFixed(2);
    const [integerPart, decimalPart] = numberValue.split('.');
    if (integerPart.length <= 3) {
      return decimalPart === '00'
        ? integerPart
        : `${integerPart}.${decimalPart}`;
    }
    const lastThreeDigits = integerPart.slice(-3);
    const otherDigits = integerPart.slice(0, -3);
    const formattedInteger =
      otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThreeDigits;
    return decimalPart === '00'
      ? formattedInteger
      : `${formattedInteger}.${decimalPart}`;
  }
  formatToIndianNumbering(amount: number | null): string {
    if (amount == null) return '-';
    const numberValue = amount.toFixed(2);
    const [integerPart, decimalPart] = numberValue.split('.');
    if (integerPart.length <= 3) {
      return `${integerPart}.${decimalPart}`;
    }
    const lastThreeDigits = integerPart.slice(-3);
    const otherDigits = integerPart.slice(0, -3);
    const formattedInteger =
      otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThreeDigits;
    return `${formattedInteger}.${decimalPart}`;
  }
  confirmDelete(id: any, ordertype: any): void {
    this.showConfirmDialogViewOrder = true;
    this.showConfirmDialog = true;
    this.itemIdToDelete = id;
    this.itemOrderType = ordertype;
  }
  getBuyingEntityData() {
    this.stockinewardService.getBuyingEntity().subscribe((res: any) => {
      this.buyingEntityData = res.$values;
      this.initializeBuyingEntityFilter();
    });
  }
  initializeBuyingEntityFilter(): void {
    this.filteredEntities = this.orderEntryForm.controls[
      'buyingEntity'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => this._filterEntity(value || '')),
    );
  }
  private _filterEntity(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.buyingEntityData.filter((option: any) =>
      option.entityName?.toLowerCase().includes(filterValue),
    );
  }
  onEntitySelected(entityName: string): void {
    const selectedEntity = this.buyingEntityData?.find(
      (option: any) => option?.entityName === entityName,
    );
    this.selectedEntityData = selectedEntity;
    this.lobDropdownData();
  }
}
