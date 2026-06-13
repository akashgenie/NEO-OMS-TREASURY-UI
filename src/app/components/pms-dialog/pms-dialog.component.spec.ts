import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmsDialogComponent } from './pms-dialog.component';

describe('PmsDialogComponent', () => {
  let component: PmsDialogComponent;
  let fixture: ComponentFixture<PmsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PmsDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PmsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
