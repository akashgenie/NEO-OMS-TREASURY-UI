import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RollOverComponent } from './roll-over.component';

describe('RollOverComponent', () => {
  let component: RollOverComponent;
  let fixture: ComponentFixture<RollOverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RollOverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RollOverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
