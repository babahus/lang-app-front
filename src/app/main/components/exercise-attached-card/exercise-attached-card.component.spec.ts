import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseAttachedCardComponent } from './exercise-attached-card.component';

describe('ExerciseAttachedCardComponent', () => {
  let component: ExerciseAttachedCardComponent;
  let fixture: ComponentFixture<ExerciseAttachedCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExerciseAttachedCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseAttachedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
