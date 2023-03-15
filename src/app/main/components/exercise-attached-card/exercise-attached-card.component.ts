import {Component, Input, OnInit} from '@angular/core';
import {Audit, CompilePhrase, Dictionary} from "../../models/exercise";

@Component({
  selector: 'app-exercise-attached-card',
  templateUrl: './exercise-attached-card.component.html',
  styleUrls: ['./exercise-attached-card.component.css']
})
export class ExerciseAttachedCardComponent implements OnInit {

  @Input() exercise! : Audit|CompilePhrase|Dictionary;
  @Input() exerciseType! : string;
  constructor() { }


  ngOnInit(): void {
  }

}
