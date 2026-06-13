import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-common-header',
  templateUrl: './common-header.component.html',
  styleUrls: ['./common-header.component.css'],
})
export class CommonHeaderComponent {
  toolTip!: string;
  isSidebarOpen = false;
  isOTCDropdownOpen = false;
  isOMSDropdownOpen = false;
  currentRoute: string = '';
  systemAccessLevel: number = 0;
  userName!: string;
  userInfo: any = this.sharedService.getSessionStorageData('personalInfo')
    ? this.sharedService.getSessionStorageData('personalInfo')
    : '';
  giveAccess: any = this.sharedService.getSessionStorageData('roleAccess')
    ? this.sharedService.getSessionStorageData('roleAccess')
    : '';

  unreadCount: number = 0;
  private subscriptions: Subscription = new Subscription();
  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.checkUserName();
    this.currentRoute = this.router.url;
    this.isOTCDropdownOpen = this.isOTCRoute();
    this.isOMSDropdownOpen = this.isOMSRoute();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
        this.isOTCDropdownOpen = this.isOTCRoute();
        this.isOMSDropdownOpen = this.isOMSRoute();
      });
  }

  logOut() {
    const token =
      this.sharedService.getSessionStorageData('personalInfo')?.token;
    this.authService.logOut(token).subscribe(
      (res) => {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['']);
      },
      (error) => {},
    );
  }
  checkUserName() {
    this.userName = this.userInfo.firstname ? `${this.userInfo.firstname}` : '';
    this.toolTip =
      this.userInfo.firstname && this.userInfo.lastname
        ? `${this.userInfo.firstname} ${this.userInfo.lastname}`
        : '';
    if (this.userName.length > 11) {
      this.userName = this.userName.slice(0, 9);
    }
  }
  redirectToHome() {
    this.router.navigateByUrl('/landing-page');
  }
  isLinkActive(route: string): boolean {
    return (
      this.currentRoute === route || this.currentRoute.startsWith(route + '/')
    );
  }
  isOTCRoute(): boolean {
    return (
      this.currentRoute.includes('/oms/brocker_details') ||
      this.currentRoute.includes('/oms/view_counter_party') ||
      this.currentRoute.includes('/oms/stock_inward') ||
      this.currentRoute.includes('/oms/allocation_dashboard') ||
      this.currentRoute.includes('/oms/generate_document_dashboard') ||
      this.currentRoute.includes('/oms/block_dashboard') ||
      this.currentRoute.includes('/oms/stock_recon_dashboard') ||
      this.currentRoute.includes('/oms/entity_lob_dashboard') ||
      this.currentRoute.includes('/oms/bank_holding_screen') ||
      this.currentRoute.includes('/oms/entity_to_entity_transfer') ||
      this.currentRoute.includes('/oms/misc_add') ||
      this.currentRoute.includes('/oms/misc_dashboard')
    );
  }
  isOMSRoute(): boolean {
    return (
      this.currentRoute.includes('/oms/cxo_common_dashboard') ||
      this.currentRoute.includes('/oms/bond_dashboard') ||
      this.currentRoute.includes('/oms/oms_operation') ||
      this.currentRoute.includes('/oms/dealer_dashboard') ||
      this.currentRoute.includes('/oms/oms_report') ||
      this.currentRoute.includes('/oms/monitoring_dashboard') ||
      this.currentRoute.includes('/oms/pmsdealing_dashboard') ||
      this.currentRoute.includes('/oms/ndpms_dashboard') ||
      this.currentRoute.includes('/oms/reconciliation') ||
      this.currentRoute.includes('/oms/master_uploads') ||
      this.currentRoute.includes('/oms/wsa_file_generation') ||
      this.currentRoute.includes('/upload-barcode') ||
      this.currentRoute.includes('/oms/AIF_mainops_dashboard')
    );
  }
  isOTCActive(): boolean {
    return this.isOTCRoute();
  }
  isOMSActive(): boolean {
    return this.isOMSRoute();
  }
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    if (!this.isSidebarOpen) {
      this.isOTCDropdownOpen = false;
      this.isOMSDropdownOpen = false;
    }
    if (this.isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
  toggleOTCDropdown(): void {
    this.isOTCDropdownOpen = !this.isOTCDropdownOpen;
    if (this.isOTCDropdownOpen) {
      this.isOMSDropdownOpen = false;
    }
  }
  toggleOMSDropdown(): void {
    this.isOMSDropdownOpen = !this.isOMSDropdownOpen;
    if (this.isOMSDropdownOpen) {
      this.isOTCDropdownOpen = false;
    }
  }
  closeSidebar(): void {
    this.isSidebarOpen = false;
    this.isOTCDropdownOpen = false;
    this.isOMSDropdownOpen = false;
    document.body.style.overflow = '';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (event.target.innerWidth > 768 && this.isSidebarOpen) {
      this.closeSidebar();
    }
  }
}
