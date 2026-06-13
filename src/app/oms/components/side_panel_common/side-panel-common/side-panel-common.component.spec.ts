import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidePanelCommonComponent } from './side-panel-common.component';

describe('SidePanelCommonComponent', () => {
  let component: SidePanelCommonComponent;
  let fixture: ComponentFixture<SidePanelCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidePanelCommonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidePanelCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
