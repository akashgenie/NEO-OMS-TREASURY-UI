import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartlyRedemptionComponent } from './partly-redemption.component';

describe('PartlyRedemptionComponent', () => {
  let component: PartlyRedemptionComponent;
  let fixture: ComponentFixture<PartlyRedemptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartlyRedemptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartlyRedemptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
