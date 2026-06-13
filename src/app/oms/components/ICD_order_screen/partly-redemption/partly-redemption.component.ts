import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-partly-redemption',
  templateUrl: './partly-redemption.component.html',
  styleUrls: ['./partly-redemption.component.css']
})
export class PartlyRedemptionComponent {
selectedProductRadioButton: string = 'ICD taken';
   selectedICDRadioButton: string = 'REDEMPTION';
   selectedRedemtionRadioButton: string = 'Partly Redemption';
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
     onRedemtionTypeRadioChange(): void {
    if (this.selectedRedemtionRadioButton === 'Full redemption') {
      this.router.navigate(['/oms/icd_redemption']);
    } else if (this.selectedRedemtionRadioButton === 'Partly Redemption') {
      this.router.navigate(['/oms/partly_redemption']);
    } else if (this.selectedRedemtionRadioButton === 'Roll Over') {
      this.router.navigate(['/oms/roll_over']);
    }
  }

}
