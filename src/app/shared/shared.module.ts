import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import {
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  MatSlideToggleModule,
  _MatSlideToggleRequiredValidatorModule,
} from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MaterialModule } from './material-module/material/material.module';
import { CommonErrorDialogComponent } from './components/common-error-dialog/common-error-dialog.component';
import { CommonSuccessDialogComponent } from './components/common-success-dialog/common-success-dialog.component';

import { CurrencyPipe } from './indianCurrencyPipe/currency.pipe';
import { CommaSeperatedPipe } from './commaSeperatedPipe/comma-seperated.pipe';

import { PMSIndianCurrencyPipe } from './PMSindianCurrencyPipe/pms-currency.pipe';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,

    CommonErrorDialogComponent,
    CommonSuccessDialogComponent,

    CurrencyPipe,
    CommaSeperatedPipe,

    PMSIndianCurrencyPipe,
  ],
  imports: [
    CommonModule,
    NgbModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,

    MatSlideToggleModule,
    MatRadioModule,
    MaterialModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,

    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,

    MaterialModule,
    CurrencyPipe,
    CommaSeperatedPipe,

    PMSIndianCurrencyPipe,
  ],
})
export class SharedModule {}
