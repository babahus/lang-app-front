import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../../../core/components/base-component/base-component.component";
import {AuthService} from "../../../core/services/auth.service";
import {ExerciseService} from "../../../core/services/exercise.service";
import {AttachedExercise} from "../../models/attached-exercise";
import {Audit, CompilePhrase, Dictionary} from "../../models/exercise";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BaseComponent implements OnInit {

  authService : AuthService;
  exerciseService : ExerciseService;
  attachedExercises! : AttachedExercise;
  exercisesForDisplay! : (Audit|CompilePhrase|Dictionary)[];
  constructor(authService : AuthService, exerciseService : ExerciseService) {
    super();
    this.authService = authService;
    this.exerciseService = exerciseService;
  }

  override async ngOnInit() {
    this.attachedExercises = await this.exerciseService.getAttachedExercise();
    this.checkCountOfAttachedExercises();
  }

  checkCountOfAttachedExercises(){
    if (this.attachedExercises.compilePhrase_exercise.length > 1)
    {
      this.exercisesForDisplay = this.attachedExercises.compilePhrase_exercise;

      return;
    }

    if (this.attachedExercises.audit_exercise.length > 1)
    {
      this.exercisesForDisplay = this.attachedExercises.audit_exercise;

      return;
    }

    if (this.attachedExercises.dictionary_exercise.length > 1){
      this.exercisesForDisplay = this.attachedExercises.dictionary_exercise

      return
    }
  }

}
