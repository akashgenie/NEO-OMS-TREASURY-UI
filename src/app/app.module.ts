import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SharedModule } from './shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { LoaderComponent } from './loader/loader/loader.component';
import { LoaderInterceptor } from './loader/loader.interceptor';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateModule } from '@angular/material-moment-adapter';
import * as _moment from 'moment';

import { SkipConfirmationDialogComponentComponent } from './components/skip-confirmation-dialog-component/skip-confirmation-dialog-component.component';

import { DeleteConfirmationDialogComponentComponent } from './components/delete-confirmation-dialog-component/delete-confirmation-dialog-component/delete-confirmation-dialog-component.component';

import { LandingComponentComponent } from './components/landing-page/landing-component/landing-component.component';
import { ToastrModule } from 'ngx-toastr';

import { TokenInterceptor } from './service/token.interceptor';

import { DuplicatePanComponent } from './components/duplicate-pan/duplicate-pan.component';

import { ConfirmDialogComponent } from './oms/dialoug_box/confirm-dialog/confirm-dialog.component';
import { SearchClientComponent } from './oms/search_client/search-client/search-client.component';

import { NgxPaginationModule } from 'ngx-pagination';

import { PmsDialogComponent } from './components/pms-dialog/pms-dialog.component';

import { NgSelectModule } from '@ng-select/ng-select';

import { SessionManagerInterceptor } from './shared/sessionManagement/session-manager.interceptor';

import { EncryptionInterceptor } from './core/interceptor/encryption.interceptor';

const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'DD-MM-YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};

@NgModule({
  declarations: [
    AppComponent,

    LoaderComponent,
    SkipConfirmationDialogComponentComponent,

    DeleteConfirmationDialogComponentComponent,

    LandingComponentComponent,

    DuplicatePanComponent,

    ConfirmDialogComponent,
    SearchClientComponent,

    PmsDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    SharedModule,
    NgbModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    CommonModule,
    MomentDateModule,

    NgxPaginationModule,
    NgSelectModule,
    ToastrModule.forRoot(),
  ],
  exports: [],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SessionManagerInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: EncryptionInterceptor,
      multi: true,
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
