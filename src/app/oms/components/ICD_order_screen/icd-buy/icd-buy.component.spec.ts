import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcdBuyComponent } from './icd-buy.component';

describe('IcdBuyComponent', () => {
  let component: IcdBuyComponent;
  let fixture: ComponentFixture<IcdBuyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IcdBuyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IcdBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
