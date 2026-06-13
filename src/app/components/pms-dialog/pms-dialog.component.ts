import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/service/shared.service';

@Component({
  selector: 'app-pms-dialog',
  templateUrl: './pms-dialog.component.html',
  styleUrls: ['./pms-dialog.component.css'],
})
export class PmsDialogComponent {
  clienTypeId: any;

  constructor(
    public dialogRef: MatDialogRef<PmsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private sharedService: SharedService,
  ) {
    this.clienTypeId = this.sharedService.getSessionStorageData('clientType');
  }
}
