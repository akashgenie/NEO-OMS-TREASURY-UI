import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrockerOrderUnlistedComponent } from './brocker-order-unlisted.component';

describe('BrockerOrderUnlistedComponent', () => {
  let component: BrockerOrderUnlistedComponent;
  let fixture: ComponentFixture<BrockerOrderUnlistedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrockerOrderUnlistedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrockerOrderUnlistedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
