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
export class DashboardComponent implements OnInit {

  authService : AuthService;
  exerciseService : ExerciseService;
  attachedExercises : any;
  listExercise = false;
  exercisesForDisplay! : (Audit|CompilePhrase|Dictionary)[];
  constructor(authService : AuthService, exerciseService : ExerciseService) {
    this.authService = authService;
    this.exerciseService = exerciseService;
  }

  ngOnInit() {
    this.exerciseService.getAttachedExercise()
      .then((response) => {
        console.log(response);
        this.attachedExercises = response;
      })
      .catch((error) => {
        console.log(error);
      });
    // console.log(this.attachedExercises);
    // this.checkCountOfAttachedExercises();
  }

  showExercise(){
    this.listExercise = !this.listExercise;
  }

  // checkCountOfAttachedExercises(){
  //   if (this.attachedExercises.compilePhrase_exercise.length > 1)
  //   {
  //     this.exercisesForDisplay = this.attachedExercises.compilePhrase_exercise;
  //
  //     return;
  //   }
  //
  //   if (this.attachedExercises.audit_exercise.length > 1)
  //   {
  //     this.exercisesForDisplay = this.attachedExercises.audit_exercise;
  //
  //     return;
  //   }
  //
  //   if (this.attachedExercises.dictionary_exercise.length > 1){
  //     this.exercisesForDisplay = this.attachedExercises.dictionary_exercise
  //
  //     return
  //   }
  // }

}
