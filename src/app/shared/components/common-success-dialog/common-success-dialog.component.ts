import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-common-success-dialog',
  templateUrl: './common-success-dialog.component.html',
  styleUrls: ['./common-success-dialog.component.css'],
})
export class CommonSuccessDialogComponent {
  message: string;
  showHideButton: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<CommonSuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.message = data.message;
    if (data?.flag) {
      this.showHideButton = data?.flag;
    }
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
