import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBrockerDetailsComponent } from './edit-brocker-details.component';

describe('EditBrockerDetailsComponent', () => {
  let component: EditBrockerDetailsComponent;
  let fixture: ComponentFixture<EditBrockerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditBrockerDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditBrockerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
