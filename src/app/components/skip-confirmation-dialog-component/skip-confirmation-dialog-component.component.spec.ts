import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkipConfirmationDialogComponentComponent } from './skip-confirmation-dialog-component.component';

describe('SkipConfirmationDialogComponentComponent', () => {
  let component: SkipConfirmationDialogComponentComponent;
  let fixture: ComponentFixture<SkipConfirmationDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkipConfirmationDialogComponentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkipConfirmationDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
