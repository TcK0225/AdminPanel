import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEditVacancyComponent } from './view-edit-vacancy.component';

describe('ViewEditVacancyComponent', () => {
  let component: ViewEditVacancyComponent;
  let fixture: ComponentFixture<ViewEditVacancyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEditVacancyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEditVacancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
