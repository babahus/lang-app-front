import {Component, Input, OnInit} from '@angular/core';
import {Audit, CompilePhrase, Dictionary} from "../../../main/models/exercise";
import {ExerciseService} from "../../services/exercise.service";

@Component({
  selector: 'app-exercise-card',
  templateUrl: './exercise-card.component.html',
  styleUrls: ['./exercise-card.component.css']
})
export class ExerciseCardComponent implements OnInit {
  @Input() exercise! : Audit|CompilePhrase|Dictionary;
  @Input() exerciseType! : string;

  public exerciseService : ExerciseService;
  constructor(exerciseService : ExerciseService) {
    this.exerciseService = exerciseService;
  }

  ngOnInit(): void {
  }
}
