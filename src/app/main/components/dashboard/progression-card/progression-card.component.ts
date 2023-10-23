import {ChangeDetectorRef, Component} from '@angular/core';
import {ExerciseService} from "../../../../core/services/exercise.service";
import {ProgressExercisesService} from "../../../../core/services/progress-exercises.service";
import {Store} from "@ngrx/store";
import {Router} from "@angular/router";
import {PseudoCryptService} from "../../../../core/services/pseudo-crypt.service";
import {ProgressExercisesCount} from "../../../models/progress-exercises-count";

@Component({
  selector: 'app-progression-card',
  templateUrl: './progression-card.component.html',
  styleUrls: ['./progression-card.component.css']
})
export class ProgressionCardComponent {
  countProgressExercises!: ProgressExercisesCount;

  constructor(private exerciseService: ExerciseService,
              private progressService: ProgressExercisesService,
              private cdr: ChangeDetectorRef
  )
  {
  }

  async ngOnInit(): Promise<void> {
    this.countProgressExercises = await this.progressService.getExercisesCountByUser(Number(sessionStorage.getItem('id')));
    this.cdr.detectChanges();
    console.log(this.countProgressExercises)
  }
}
