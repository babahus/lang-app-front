import { Component, OnInit } from '@angular/core';
import {ExerciseService} from "../../../core/services/exercise.service";
import {AttachedExercise} from "../../models/attached-exercise";
import {BaseComponent} from "../../../core/components/base-component/base-component.component";

@Component({
  selector: 'app-exercises-my',
  templateUrl: './exercises-my.component.html',
  styleUrls: ['./exercises-my.component.css']
})
export class ExercisesMyComponent extends BaseComponent implements OnInit {

  public attachedExercises! : AttachedExercise;
  public exerciseCategory : string = 'compile_phrase';
  public exerciseService : ExerciseService;
  isDashboardToggle: boolean = false;
  constructor(exerciseService : ExerciseService) {
    super();
    this.exerciseService = exerciseService;
  }

  data: any;

  override async ngOnInit(): Promise<void> {
    this.attachedExercises = await this.exerciseService.getAttachedExercise();
    this.data = this.attachedExercises;
    console.log(this.attachedExercises)
  }

  toggleDashboardMenu() {
    this.isDashboardToggle =! this.isToggle;
  }
}
