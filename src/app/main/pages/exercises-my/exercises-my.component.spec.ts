import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercisesMyComponent } from './exercises-my.component';

describe('ExercisesMyComponent', () => {
  let component: ExercisesMyComponent;
  let fixture: ComponentFixture<ExercisesMyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExercisesMyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExercisesMyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
