import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../../../core/components/base-component/base-component.component";
import {AuthService} from "../../../core/services/auth.service";
import {ExerciseService} from "../../../core/services/exercise.service";
import {AttachedExercise} from "../../models/attached-exercise";
import {Audit, CompilePhrase, Dictionary} from "../../models/exercise";
import {ProfileService} from "../../../core/services/profile-service.service";
import {combineLatest} from "rxjs";

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
  public currentUserRole!: string | undefined;
  exercisesForDisplay! : (Audit|CompilePhrase|Dictionary)[];
  constructor(authService : AuthService, exerciseService : ExerciseService, private profileService: ProfileService) {
    this.authService = authService;
    this.exerciseService = exerciseService;
    combineLatest([
      this.profileService.currentUserRole$,
      this.profileService.currentUserId$
    ]).subscribe(([role, userId]) => {
      this.currentUserRole = role;

    });
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
