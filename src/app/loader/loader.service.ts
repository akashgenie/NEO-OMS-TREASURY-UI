import { Injectable } from '@angular/core';
import { LoaderComponent } from './loader/loader.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private opened = false;
  private dialogRef!: MatDialogRef<LoaderComponent>;
  private loading: any = new BehaviorSubject(false);

  constructor(private dialog: MatDialog) {}
  openDialog(check: any): void {
    if (!this.opened) {
      this.opened = true;
      this.dialogRef = this.dialog.open(LoaderComponent, {
        data: undefined,
        maxHeight: '170px',

        width: '250px',
        maxWidth: '100%',
        disableClose: true,
        autoFocus: false,
        hasBackdrop: true,
      });

      this.dialogRef.afterOpened().subscribe(() => {});

      this.dialogRef.afterClosed().subscribe(() => {
        this.opened = false;
      });
    }
  }

  hideDialog() {
    this.dialogRef.close();
  }

  setLoading(loading: boolean) {
    this.loading.next(loading);
  }

  getLoading(): any {
    return this.loading;
  }
}
