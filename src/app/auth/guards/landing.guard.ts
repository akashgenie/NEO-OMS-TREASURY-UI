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
export class LandingGuard implements CanActivate {
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
    if (!authUser?.token) {
      sessionStorage.removeItem('personalInfo');
      this.router.navigate(['']);
      return false;
    }
    return true;
  }
}
