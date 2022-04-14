import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformChargesComponent } from './platform-charges.component';

describe('PlatformChargesComponent', () => {
  let component: PlatformChargesComponent;
  let fixture: ComponentFixture<PlatformChargesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatformChargesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
