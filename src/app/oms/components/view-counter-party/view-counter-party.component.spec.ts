import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCounterPartyComponent } from './view-counter-party.component';

describe('ViewCounterPartyComponent', () => {
  let component: ViewCounterPartyComponent;
  let fixture: ComponentFixture<ViewCounterPartyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewCounterPartyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewCounterPartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
