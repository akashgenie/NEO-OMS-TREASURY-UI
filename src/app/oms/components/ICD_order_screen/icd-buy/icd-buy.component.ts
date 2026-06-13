import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-icd-buy',
  templateUrl: './icd-buy.component.html',
  styleUrls: ['./icd-buy.component.css']
})
export class IcdBuyComponent {
   selectedProductRadioButton: string = 'ICD taken';
   selectedICDRadioButton: string = 'BUY';
constructor( private router: Router) {

}
ngOnInit() {

}
  onProductTypeRadioChange(): void {
    if (this.selectedProductRadioButton === 'ICD taken') {
      this.router.navigate(['/oms/icd_buy']);
      // this.router.navigate(['/fixed-deposit']);
    } else if (this.selectedProductRadioButton === 'ICD Given') {
      this.router.navigate(['/oms/icd_redemption']);
    }
    else if (this.selectedProductRadioButton === 'Additional_BUY') {
      this.router.navigate(['/oms/pms_additional_buy']);
    }
  }
   onICDTypeRadioChange(): void {
    if (this.selectedICDRadioButton === 'BUY') {
      this.router.navigate(['/oms/icd_buy']);
      // this.router.navigate(['/fixed-deposit']);
    } else if (this.selectedICDRadioButton === 'REDEMPTION') {
      this.router.navigate(['/oms/icd_redemption']);
    }

  }
}
