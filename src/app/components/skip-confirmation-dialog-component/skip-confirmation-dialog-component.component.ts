import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from 'src/app/shared/service/shared.service';

@Component({
  selector: 'app-skip-confirmation-dialog-component',
  templateUrl: './skip-confirmation-dialog-component.component.html',
  styleUrls: ['./skip-confirmation-dialog-component.component.css'],
})
export class SkipConfirmationDialogComponentComponent {
  message: string;
  showHideButton: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<SkipConfirmationDialogComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedService: SharedService,
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
