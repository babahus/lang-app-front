import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachExerciseComponent } from './attach-exercise.component';

describe('AttachExerciseComponent', () => {
  let component: AttachExerciseComponent;
  let fixture: ComponentFixture<AttachExerciseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttachExerciseComponent]
    });
    fixture = TestBed.createComponent(AttachExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
