import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrockerDetailsComponent } from './brocker-details.component';

describe('BrockerDetailsComponent', () => {
  let component: BrockerDetailsComponent;
  let fixture: ComponentFixture<BrockerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrockerDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrockerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
