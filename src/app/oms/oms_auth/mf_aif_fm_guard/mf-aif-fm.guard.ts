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
export class MfAifFmGuard implements CanActivate {
  constructor(
    private router: Router,
    private sharedService: SharedService,
  ) {}

  giveAccess: any = '';

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
    this.giveAccess = this.sharedService.getSessionStorageData('roleAccess')
      ? this.sharedService.getSessionStorageData('roleAccess')
      : '';

    if (
      authUser?.token &&
      this.giveAccess?.fMdashboard &&
      !this.giveAccess?.bondops &&
      this.giveAccess?.rolename != 'BONDOPS'
    ) {
      return true;
    } else {
      sessionStorage.clear();
      localStorage.clear();
      this.router.navigate(['']);
      return false;
    }
  }
}
