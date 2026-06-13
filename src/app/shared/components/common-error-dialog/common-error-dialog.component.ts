import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-common-error-dialog',
  templateUrl: './common-error-dialog.component.html',
  styleUrls: ['./common-error-dialog.component.css'],
})
export class CommonErrorDialogComponent {
  message: string;
  showHideButton: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<CommonErrorDialogComponent>,
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
