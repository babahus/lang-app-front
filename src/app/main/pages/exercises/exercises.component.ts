import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BaseComponent} from "../../../core/components/base-component/base-component.component";
import {ExerciseService} from "../../../core/services/exercise.service";
import {Audit, CompilePhrase, Dictionary} from "../../models/exercise";

export interface Exercise {
  header: string;
  description: string;
  creator: string;
  // add any other properties here
}

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.css']
})

export class ExercisesComponent extends BaseComponent implements OnInit,AfterViewInit {

  exerciseService : ExerciseService;

  public exercises!: (Audit | CompilePhrase | Dictionary)[];
  public auditExercise!: Audit[] | CompilePhrase[] | Dictionary[];
  public compilePhraseExercises!: (Audit | CompilePhrase | Dictionary)[];
  public exerciseType: string = 'compile_phrase';

  constructor(exerciseService : ExerciseService) {
    super();
    this.exerciseService = exerciseService;
  }

  override async ngOnInit() {
    this.auditExercise = await this.exerciseService.getExercisesByType('audit');
    this.exercises = await this.exerciseService.getExercisesByType('compile_phrase');
    this.compilePhraseExercises = this.exercises;
  }

  ngAfterViewInit() {
    console.log(this.exercises);
  }


  async getExercises(type: string) {
    this.exerciseType = type;
    this.exercises = await this.exerciseService.getExercisesByType(type);
  }
}
