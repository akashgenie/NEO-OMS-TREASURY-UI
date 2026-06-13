import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { SharedService } from 'src/app/shared/service/shared.service';

@Injectable({
  providedIn: 'root',
})
export class CommonGuard implements CanActivate {
  constructor(
    private router: Router,
    private sharedService: SharedService,
  ) {}

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
    let roleAccess: any =
      this.sharedService.getSessionStorageData('roleAccess');

    if (!authUser?.token) {
      sessionStorage.removeItem('personalInfo');
      this.router.navigate(['']);
      return false;
    }

    const systemAccessLevel = roleAccess?.systemAccessLevel;
    if (systemAccessLevel == 1) {
      sessionStorage.removeItem('personalInfo');
      this.router.navigate(['']);
      return false;
    }

    return true;
  }
  getUserRole(): string {
    const personalInfo =
      this.sharedService.getSessionStorageData('personalInfo');
    return personalInfo.role;
  }
}
