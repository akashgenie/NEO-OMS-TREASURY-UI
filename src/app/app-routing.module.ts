import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { CommonGuard } from './auth/guards/common.guard';

import { LandingComponentComponent } from './components/landing-page/landing-component/landing-component.component';

import { SearchClientComponent } from './oms/search_client/search-client/search-client.component';

import { LandingGuard } from './auth/guards/landing.guard';

const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () =>
  //     import('./components/login/login.module').then((m) => m.LoginModule),
  // },

  {
    path: 'oms',
    loadChildren: () => import('./oms/oms.module').then((m) => m.OmsModule),
    data: { preload: true },
  },
 {

    path: '',



    component: LandingComponentComponent

  },
  // {
  //   path: 'landing-page',
  //   canActivate: [LandingGuard],
  //   component: LandingComponentComponent,
  // },

  { path: 'search_client', component: SearchClientComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules, // Ye line add karo
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
