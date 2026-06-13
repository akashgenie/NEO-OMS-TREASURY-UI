import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/shared/service/shared.service';

import { AuthService } from 'src/app/service/auth/auth.service';
import { ClientmasterService } from 'src/app/service/clientmaster.service';
import { DeleteConfirmationDialogComponentComponent } from '../../delete-confirmation-dialog-component/delete-confirmation-dialog-component/delete-confirmation-dialog-component.component';
import { MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-landing-component',
  templateUrl: './landing-component.component.html',
  styleUrls: ['./landing-component.component.css'],
})
export class LandingComponentComponent {
  isOTCMenuOpen = false;

  toggleOTCMenu() {
    this.isOTCMenuOpen = !this.isOTCMenuOpen;
  }

  userInfo: any = this.sharedService.getSessionStorageData('personalInfo')
    ? this.sharedService.getSessionStorageData('personalInfo')
    : '';

  giveAccess: any = this.sharedService.getSessionStorageData('roleAccess')
    ? this.sharedService.getSessionStorageData('roleAccess')
    : '';

  userName!: string;
  toolTip!: string;
  systemAccessLevel: number = 0;
  constructor(
    private authService: AuthService,
    private router: Router,
    private sharedService: SharedService,
    private http: HttpClient,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private clientService: ClientmasterService,
  ) {}
  ngOnInit() {
    this.giveAccess = this.sharedService.getSessionStorageData('roleAccess');
    this.systemAccessLevel = this.giveAccess?.systemAccessLevel;
    this.checkUserName();
  }

  checkUserName() {
    this.userName = this.userInfo.firstname ? `${this.userInfo.firstname}` : '';
    this.toolTip =
      this.userInfo.firstname && this.userInfo.lastname
        ? `${this.userInfo.firstname}`
        : '';
    if (this.userName.length > 11) {
      this.userName = this.userName.slice(0, 9);
    }
  }
  navigateModification() {
    this.router.navigate(['/modification']);
  }
  getAllBankers() {
    this.clientService.getAllBankers(0).subscribe((res: any) => {
      this.sharedService.addSessionStorageData('bankerData', res);
    });
  }

  navigateDashborad() {
    this.sharedService.removeLocalStorageItem('dialog');
    this.router.navigate(['/dashboard']);
  }
  navigateAddNewClient() {
    this.sharedService.insertLocalStoragData('dialog', 'yes');
    if (this.sharedService.giveLocalStorageData('dialog')) {
      this.router.navigateByUrl('/dashboard');
    }
  }
  navigateOmsSearchClient() {
    localStorage.setItem('omsdialog', 'yes');
    if (localStorage.getItem('omsdialog')) {
      this.router.navigateByUrl('oms/cxo_common_dashboard');
    }
  }
  navigateOmsSearchHoldingClient() {
    this.router.navigateByUrl('oms/sync_client');
  }
  navigateFamilyCreation() {
    this.router.navigate(['/family-creation']);
  }
  navigateAccreditationCertificate() {
    this.router.navigate(['/accreditation-certificate']);
  }

  diyJourney() {
    this.router.navigate(['diy/diy_dashboard']);
  }

  userLogout() {
    const dialogRef = this.dialog.open(
      DeleteConfirmationDialogComponentComponent,
      {
        width: '350px',
        data: {
          message: 'Are you sure want to log out?',
        },
      },
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.logOut();
      } else {
      }
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
  checkNavigation() {
    this.router.navigateByUrl('/oms/oms_operation');
  }
  checkPMSDash() {
    if (this.giveAccess?.pmsopsdashboard) {
      this.router.navigateByUrl('/oms/pmsdealing_dashboard');
    }
  }

  downloadMorMisReport() {
    const apiUrl = `${this.sharedService.baseUrl}Diy/ExportMis`;

    this.http
      .get(apiUrl, { responseType: 'blob', observe: 'response' })
      .subscribe(
        (response) => {
          const blob = response.body;
          if (!blob) {
            return;
          }

          let fileName = 'MOR_MIS_Report';
          const contentDisposition = response.headers.get(
            'content-disposition',
          );
          if (contentDisposition) {
            const match = /filename\*?=(?:UTF-8'')?"?([^;\"]+)"?/.exec(
              contentDisposition,
            );
            if (match && match[1]) {
              fileName = decodeURIComponent(match[1].trim());
            }
          }

          if (!fileName.includes('.')) {
            fileName += '.xlsx';
          }

          const downloadUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(downloadUrl);
        },
        (error) => {},
      );
  }

  navigatePmsDashboardClient() {
    this.sharedService.insertLocalStoragData('pmsclientdialog', 'yes');
    if (this.sharedService.giveLocalStorageData('pmsclientdialog')) {
      this.router.navigateByUrl('/pms-dashboard');
    }
  }

  navigateWealthInDashboardClient() {
    this.sharedService.insertLocalStoragData('wealthInclientdialog', 'yes');
    if (this.sharedService.giveLocalStorageData('wealthInclientdialog')) {
      this.router.navigateByUrl('/wealthIn-dashboard');
    }
  }
  ngOnDestroy() {
    this.sharedService.removeSessionStorageData('editMode');
    this.sharedService.removeSessionStorageData('editInwardId');
  }
}
