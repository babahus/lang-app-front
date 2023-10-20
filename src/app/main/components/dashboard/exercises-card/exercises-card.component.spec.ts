import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercisesCardComponent } from './exercises-card.component';

describe('ExercisesCardComponent', () => {
  let component: ExercisesCardComponent;
  let fixture: ComponentFixture<ExercisesCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExercisesCardComponent]
    });
    fixture = TestBed.createComponent(ExercisesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
