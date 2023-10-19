import { Component, OnInit } from '@angular/core';
import { ExerciseService } from "../../../../core/services/exercise.service";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Sentence } from "../../../models/exercise";

@Component({
  selector: 'app-sentence',
  templateUrl: './sentence.component.html',
  styleUrls: ['./sentence.component.css']
})
export class SentenceComponent implements OnInit {
  exerciseService: ExerciseService;
  id: string | null | number;
  sentence!: Sentence;
  sentenceStr: string = '';
  sentenceArr: any = [];
  sentenceForm: FormGroup;

  changeSentence() {
    this.sentenceArr.forEach((word: any, index: any) => {
      this.sentenceStr = this.sentenceStr.replace(word, "___");
      this.sentenceForm.addControl(`data${index}`, this.fb.control(''));
    });
    console.log(this.sentenceStr);
  }

  constructor(
    exerciseService: ExerciseService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.exerciseService = exerciseService;
    this.id = this.route.snapshot.params['id'];

    this.sentenceForm = fb.group({});
  }

  async ngOnInit(): Promise<void> {
    this.sentence = await this.exerciseService.getExerciseByTypeAndId(
      'sentence',
      this.id
    );

    this.sentenceStr = this.sentence.sentence_with_gaps;
    this.sentenceArr = this.sentence.correct_answers_json;
    this.changeSentence();
  }

  checkAnswer(){
    console.log(this.sentenceForm);
  }
}
