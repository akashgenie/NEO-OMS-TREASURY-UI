import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcdRedemtpionComponent } from './icd-redemtpion.component';

describe('IcdRedemtpionComponent', () => {
  let component: IcdRedemtpionComponent;
  let fixture: ComponentFixture<IcdRedemtpionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IcdRedemtpionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IcdRedemtpionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
