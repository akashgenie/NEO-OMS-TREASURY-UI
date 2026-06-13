import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CxoGuard } from './oms_auth/cxo_dash_guard/cxo.guard';

import { BrockerDetailsComponent } from './components/brocker-details/brocker-details/brocker-details.component';
import { AddBrockerGuard } from './oms_auth/add_brocker_guard/add-brocker.guard';

import { BlockOrderAuthGuard } from './oms_auth/block_order_auth/block-order-auth.guard';
import { BrockerOrderUnlistedComponent } from './components/brocker_order_unlisted/brocker-order-unlisted/brocker-order-unlisted.component';

import { ViewCounterPartyComponent } from './components/view-counter-party/view-counter-party.component';

import { EditBrockerDetailsComponent } from './components/brocker-details/edit_brocker_details/edit-brocker-details/edit-brocker-details.component';

const routes: Routes = [
  {
    path: 'brocker_details',
    canActivate: [AddBrockerGuard],
    component: BrockerDetailsComponent,
  },

  {
    path: 'brocker_unlisted_order',
    canActivate: [BlockOrderAuthGuard],
    component: BrockerOrderUnlistedComponent,
  },

  { path: 'view_counter_party', component: ViewCounterPartyComponent },
  { path: 'edit_brocker_details', component: EditBrockerDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OmsRoutingModule {}
