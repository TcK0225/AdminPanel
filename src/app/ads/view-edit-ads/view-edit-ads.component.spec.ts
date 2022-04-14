import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEditAdsComponent } from './view-edit-ads.component';

describe('ViewEditAdsComponent', () => {
  let component: ViewEditAdsComponent;
  let fixture: ComponentFixture<ViewEditAdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEditAdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEditAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
