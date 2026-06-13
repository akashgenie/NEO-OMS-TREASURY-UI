import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { OmsRoutingModule } from './oms-routing.module';

import { SharedModule } from '../shared/shared.module';
import { OmdDashboardSearchPipe } from './dashboard-search-filter/omd-dashboard-search/omd-dashboard-search.pipe';

import { NgxPaginationModule } from 'ngx-pagination';

import { NumberToWordsPipe } from './components/customNumberPipe/number-to-words.pipe';

import { CommaSeparatedDirective } from './components/comma_seperadted_directive/comma-separated.directive';

import { BrockerOrderUnlistedComponent } from './components/brocker_order_unlisted/brocker-order-unlisted/brocker-order-unlisted.component';
import { BrockerDetailsComponent } from './components/brocker-details/brocker-details/brocker-details.component';

import { ViewCounterPartyComponent } from './components/view-counter-party/view-counter-party.component';
import { CommonHeaderComponent } from './components/common_header/common-header/common-header.component';

import { BondDashboardSearchPipe } from './dashboard-search-filter/bond-dashboard-search/bond-dashboard-search.pipe';
import { DealerFilterPipe } from './dashboard-search-filter/dealer_filter/dealer-filter.pipe';
import { FmDashboardPipe } from './dashboard-search-filter/fm_dashboard/fm-dashboard.pipe';
import { RIACommonDashboardPipe } from './dashboard-search-filter/RIA_common_dashboard/ria-common-dashboard.pipe';
import { RIAMFDashboardPipe } from './dashboard-search-filter/RIA_MF_dashboard/ria-mf-dashboard.pipe';
import { RIAAIFDashboardPipe } from './dashboard-search-filter/RIA_AIF_dashboard/ria-aif-dashboard.pipe';

import { UnlistedCommonDashboardPipe } from './dashboard-search-filter/unlisted_common_dashboard/unlisted-common-dashboard.pipe';
import { BlockDashboardSearchPipe } from './dashboard-search-filter/block_dashboard_search/block-dashboard-search.pipe';

import { OperationDashboardPipe } from './dashboard-search-filter/operation-dashboard-search/operation-dashboard.pipe';
import { MonitoringDashboardPipe } from './dashboard-search-filter/monitoring-dashboard-search/monitoring-dashboard.pipe';

import { OmsSearchFilterPipe } from './oms_search_filter/oms-search-filter.pipe';

import { EditBrockerDetailsComponent } from './components/brocker-details/edit_brocker_details/edit-brocker-details/edit-brocker-details.component';

import { DematReconDashboardPipe } from './dashboard-search-filter/demat_recon_dashboard/demat-recon-dashboard.pipe';
import { AllocationDashboardPipe } from './dashboard-search-filter/allocation_dashboard/allocation-dashboard.pipe';
import { ViewCounterPartyPipe } from './dashboard-search-filter/view_counter_party/view-counter-party.pipe';

import { WsaFileGenPipe } from './dashboard-search-filter/wsa_file_generation/wsa-file-gen.pipe';
import { MAT_DATE_FORMATS } from '@angular/material/core';

import { MomentDateModule } from '@angular/material-moment-adapter';

import { BankerDashboardSearchPipe } from './dashboard-search-filter/banker-dashboard-search/banker-dashboard-search.pipe';

import { MonthYeaFormatPipe } from './dashboard-search-filter/month_year/month-yea-format.pipe';

import { CommonFooterComponent } from './components/common_footer/common-footer/common-footer.component';

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
    OmdDashboardSearchPipe,
    NumberToWordsPipe,

    OmsSearchFilterPipe,

    CommaSeparatedDirective,

    BrockerOrderUnlistedComponent,
    BrockerDetailsComponent,
    EditBrockerDetailsComponent,

    ViewCounterPartyComponent,
    CommonHeaderComponent,

    BondDashboardSearchPipe,
    DealerFilterPipe,
    FmDashboardPipe,
    RIACommonDashboardPipe,
    RIAMFDashboardPipe,
    RIAAIFDashboardPipe,
    DematReconDashboardPipe,
    UnlistedCommonDashboardPipe,
    BlockDashboardSearchPipe,

    AllocationDashboardPipe,
    ViewCounterPartyPipe,
    OperationDashboardPipe,
    MonitoringDashboardPipe,

    WsaFileGenPipe,

    BankerDashboardSearchPipe,

    MonthYeaFormatPipe,

    CommonFooterComponent,
  ],
  imports: [
    CommonModule,
    OmsRoutingModule,

    SharedModule,
    NgxPaginationModule,
    MomentDateModule,
  ],

  providers: [DatePipe, { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
})
export class OmsModule {}
