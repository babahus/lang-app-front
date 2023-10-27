import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ExerciseService} from "../../../core/services/exercise.service";
import {Exercise} from "../../models/exercise";

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.css']
})

export class ExercisesComponent implements OnInit{
  exerciseTypes: string[] = ['compile_phrase', 'audit', 'pair_exercise', 'picture_exercise', 'sentence'];
  selectedType: string = '';
  currentPage: { [key: string]: number } = {};
  exerciseData: any;
  totalPages: number = 1;
  // public exercises!: (Audit | CompilePhrase | Dictionary)[];
  // public auditExercise!: Audit[] | CompilePhrase[] | Dictionary[];
  // public compilePhraseExercises!: (Audit | CompilePhrase | Dictionary)[];
  // public exerciseType: string = 'compile_phrase';

  constructor(private exerciseService: ExerciseService) {

  }

  async ngOnInit() {

  }


  // override async ngOnInit() {
  //   this.auditExercise = await this.exerciseService.getExercisesByType('audit');
  //   this.exercises = await this.exerciseService.getExercisesByType('compile_phrase');
  //   this.compilePhraseExercises = this.exercises;
  // }
  //
  // ngAfterViewInit() {
  //   console.log(this.exercises);
  // }
  //
  //
  // async getExercises(type: string) {
  //   this.exerciseType = type;
  //   this.exercises = await this.exerciseService.getExercisesByType(type);
  // }
}
