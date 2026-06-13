import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicatePanComponent } from './duplicate-pan.component';

describe('DuplicatePanComponent', () => {
  let component: DuplicatePanComponent;
  let fixture: ComponentFixture<DuplicatePanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DuplicatePanComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DuplicatePanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
