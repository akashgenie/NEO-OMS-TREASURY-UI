import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/shared/service/shared.service';

@Injectable({
  providedIn: 'root',
})
export class BlockOrderAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private sharedService: SharedService,
  ) {}
  giveAccess: any = this.sharedService.getSessionStorageData('roleAccess')
    ? this.sharedService.getSessionStorageData('roleAccess')
    : '';

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let authUser: any =
      this.sharedService.getSessionStorageData('personalInfo');

    let brokerCode = this.sharedService.getLocalStorageData('brokerCode')
      ? this.sharedService.getLocalStorageData('brokerCode')
      : '';

    let isInternal = this.sharedService.getLocalStorageData('isInternal')
      ? this.sharedService.getLocalStorageData('isInternal')
      : '';

    if (authUser?.token && brokerCode) {
      return true;
    } else {
      sessionStorage.clear();
      localStorage.clear();
      this.router.navigate(['']);
      return false;
    }
  }
}
