import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseSolveExerciseComponent } from './base-solve-exercise.component';

describe('BaseSolveExerciseComponent', () => {
  let component: BaseSolveExerciseComponent;
  let fixture: ComponentFixture<BaseSolveExerciseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BaseSolveExerciseComponent]
    });
    fixture = TestBed.createComponent(BaseSolveExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
