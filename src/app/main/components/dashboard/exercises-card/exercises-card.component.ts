import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {ExerciseService} from "../../../../core/services/exercise.service";
import {Exercise} from "../../../models/exercise";
import {PseudoCryptService} from "../../../../core/services/pseudo-crypt.service";
import {Router} from "@angular/router";
import {ProgressExercisesService} from "../../../../core/services/progress-exercises.service";
import {ProgressData} from "../../../models/progress-data";

@Component({
  selector: 'app-exercises-card',
  templateUrl: './exercises-card.component.html',
  styleUrls: ['./exercises-card.component.css']
})
export class ExercisesCardComponent implements OnInit{
  public attachedExercises!: Exercise|any;
  public exerciseProgress!: ProgressData[];

  constructor(private exerciseService: ExerciseService,
              private progressService: ProgressExercisesService,
              private store : Store,
              private router : Router,
              private cryptoService : PseudoCryptService,
  )
  {
  }

  async ngOnInit(): Promise<void> {
    this.exerciseProgress = await this.progressService.getExercisesProgressByUser(Number(sessionStorage.getItem('id')));
    this.attachedExercises = await this.exerciseService.getAttachedExercise();
    console.log(this.attachedExercises)
    console.log(this.exerciseProgress)
  }

  isExerciseCompleted(exerciseId : number): boolean {
    const foundProgress = this.exerciseProgress.find(progress => progress.accounts_exercise_id === exerciseId);

    return !!foundProgress && foundProgress.user_progress !== null;
  }

  navigateToExercise(exercise: any) {
    if(!this.isExerciseCompleted(exercise['id'])) {
      const link = ['/exercises/'+exercise['type'], exercise['data']['id']];
      const queryParams = { data: this.getEncryptedParams(null, null, exercise['id']) };
      this.router.navigate(link, { queryParams: queryParams });
    }
  }

  getEncryptedParams(courseId: number|null, stageId: number|null, exerciseId: number): string {
    const paramString = `${courseId},${stageId},${exerciseId}`;
    return this.cryptoService.encrypt(paramString);
  }

}
