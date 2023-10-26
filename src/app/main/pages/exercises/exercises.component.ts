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

  async fetchExerciseData(type: string) {
    try {
      this.selectedType = type;
      const responseAttachedExercise = await this.exerciseService.getAttachedExerciseType(type);
      const responseExercise = await this.exerciseService.getExerciseData(type, this.currentPage[this.selectedType]);
      const combinedExercises = responseExercise.data.data.map((exercise: Exercise) => ({
        ...exercise,
        attached: responseAttachedExercise.data.data.some((studentExercise: Exercise) => studentExercise.id === exercise.id),
      }));

      this.exerciseData = combinedExercises;
      this.currentPage[this.selectedType] = responseExercise.data.pagination.current_page;
      this.totalPages = responseExercise.data.pagination.last_page;
    } catch (error) {
      console.log(error);
    }
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
