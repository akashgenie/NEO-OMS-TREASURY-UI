import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PlaceOrderService } from 'src/app/oms/oms_services/place-order/place-order.service';
import { SharedService } from 'src/app/shared/service/shared.service';

@Component({
  selector: 'app-side-panel-common',
  templateUrl: './side-panel-common.component.html',
  styleUrls: ['./side-panel-common.component.css']
})
export class SidePanelCommonComponent {
constructor( private sharedService: SharedService,
      private router: Router,
      private placeOrderService: PlaceOrderService,) { }
ngOnInit(): void {
   this.getPlaceOrder();
}
showHideViewCart: boolean = false;
  showHideClientDetails: boolean = false;
  viewData: any[] = [];
  placeOrderData: any;
  showHideBank: boolean = false;
  showHideDp: boolean = false;
  bankData: any[] = [];
  selectedBank: any = null; // currently selected bank object
  selectedBankKey: any;
  selectedDp: any = null;
  selectedDpKey: string | null = null;
  accountType: string = '';
  dematUccFlag: any = false;
  bankDetails: any;
  dematDetails: any;
  cartData: any;
  dpData: any[] = [];
  enableDisableHideClientDetails(check: string) {
    if (check == 'open') {
      this.showHideClientDetails = true;
      this.getViewData();
    } else if (check == 'close') {
      this.showHideClientDetails = false;
    }
  }
  getViewData() {
    const uccCode = this.sharedService.getLocalStorageData('uccCode');
    this.placeOrderService
      .getPlaceOrderViewData(uccCode)
      .subscribe((res: any) => {
        this.viewData = res.$values;
      });
  }
  enableDisableBankDet(check: string) {
    if (check == 'openBank') {
      this.showHideBank = true;
      this.getBankData();
    } else if (check == 'closeBank') {
      this.showHideBank = false;
      this.getPlaceOrder();
    }
  }
  getBankData() {
    const uccCode = this.sharedService.getLocalStorageData('uccCode');
    this.placeOrderService.postBankDat(uccCode).subscribe((res: any) => {
      this.bankData = res.$values;
      if (!this.selectedBankKey && this.bankData.length > 0) {
        const first = this.bankData[0];
        this.selectedBank = first;
        this.selectedBankKey = first.bankId ?? first.bankAccountNumber;
      } else {
        const found = this.bankData.find(
          (b) => (b.bankId ?? b.bankAccountNumber) === this.selectedBankKey,
        );
        if (found) {
          this.selectedBank = found;
        }
      }
    });
  }
  enableDisableDp(check: string) {
    if (check == 'openDp') {
      this.showHideDp = true;
      this.getDpData();
    } else if (check == 'closeDp') {
      this.showHideDp = false;
      this.getPlaceOrder();
    }
  }
  getDpData() {
    const uccCode = this.sharedService.getLocalStorageData('uccCode');
    this.placeOrderService.postDpData(uccCode).subscribe((res: any) => {
      this.dpData = res.$values;
      if (!this.selectedDpKey && this.dpData.length > 0) {
        const first = this.dpData[0];
        this.selectedDp = first;
        this.selectedDpKey = first.dpId ?? first.dpClientId ?? null;
      } else {
        const found = this.dpData.find(
          (b) => (b.dpId ?? b.dpClientId) === this.selectedDpKey,
        );
        if (found) this.selectedDp = found;
      }
    });
  }
  selectBank(bank: any) {
    this.selectedBank = bank;
    if (bank?.bankId != null) this.selectedBankKey = bank.bankId;
    else this.selectedBankKey = bank.bankAccountNumber;
  }

  isSelected(bank: any): boolean {
    if (!bank) return false;
    const key = bank.bankId != null ? bank.bankId : bank.bankAccountNumber;
    return this.selectedBankKey != null && this.selectedBankKey === key;
  }
  selectDp(dp: any) {
    this.selectedDp = dp;
    this.selectedDpKey = dp?.dpId ?? dp?.dpClientId ?? null;
  }
  isDpSelected(dp: any): boolean {
    if (!dp) return false;
    const key = dp?.dpId ?? dp?.dpClientId;
    return this.selectedDpKey != null && this.selectedDpKey === key;
  }
  getPlaceOrder() {
    // const uccCode = this.sharedService?.getLocalStorageData('uccCode');
    const uccCode = '100278';
    const bankAccountNo = this.selectedBank?.bankAccountNumber || '';
    const dpClientId = this.selectedDp?.dpClientId || '';
    this.placeOrderService
      .getClientDetails(uccCode, bankAccountNo, dpClientId)
      .subscribe((res: any) => {

          // this.checkAccType(res);
          this.placeOrderData = res;

          this.accountType = (res?.accountType || '').toUpperCase().trim();
          this.bankDetails = {
            acNo: res.accountNo,
            clientId: res.clientId,
            ifscCode: res.ifscCode,
            isBankPrimary: res.isBankPrimary,
            bankPOA: res.bankPOA,
          };
          this.dematDetails = {
            dpId: res.dpId,
            isDPPriamry: res.isDPPriamry,
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
         ;


      });
  }
}
