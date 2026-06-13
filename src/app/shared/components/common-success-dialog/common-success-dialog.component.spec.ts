import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonSuccessDialogComponent } from './common-success-dialog.component';

describe('CommonSuccessDialogComponent', () => {
  let component: CommonSuccessDialogComponent;
  let fixture: ComponentFixture<CommonSuccessDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommonSuccessDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommonSuccessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
