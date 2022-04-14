import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEditJobComponent } from './view-edit-job.component';

describe('ViewEditJobComponent', () => {
  let component: ViewEditJobComponent;
  let fixture: ComponentFixture<ViewEditJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEditJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEditJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
