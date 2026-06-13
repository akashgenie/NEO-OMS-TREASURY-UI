import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation-dialog-component',
  templateUrl: './delete-confirmation-dialog-component.component.html',
  styleUrls: ['./delete-confirmation-dialog-component.component.css'],
})
export class DeleteConfirmationDialogComponentComponent {
  message: string;
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.message = data.message;
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
