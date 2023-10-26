import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesTeacherCardComponent } from './courses-teacher-card.component';

describe('CoursesTeacherCardComponent', () => {
  let component: CoursesTeacherCardComponent;
  let fixture: ComponentFixture<CoursesTeacherCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoursesTeacherCardComponent]
    });
    fixture = TestBed.createComponent(CoursesTeacherCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
