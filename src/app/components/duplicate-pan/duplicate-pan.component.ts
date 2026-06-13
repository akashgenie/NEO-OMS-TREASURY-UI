import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-duplicate-pan',
  templateUrl: './duplicate-pan.component.html',
  styleUrls: ['./duplicate-pan.component.css'],
})
export class DuplicatePanComponent {
  message: any;
  showOk: any = true;

  constructor(
    public dialogRef: MatDialogRef<DuplicatePanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
  ) {
    this.message = data.message;
    this.showOk = data.allow;
  }

  navigateToDashboard(): void {
    this.dialogRef.close();
    this.router.navigate(['/landing-page']);
  }
}
