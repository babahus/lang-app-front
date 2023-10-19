import { Component, OnInit } from '@angular/core';
import { ExerciseService } from "../../../../core/services/exercise.service";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Sentence } from "../../../models/exercise";
import Swal from "sweetalert2";

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
  studentAnswers: string[] = [];

  changeSentence() {
    this.sentenceArr.forEach((word: any, index: any) => {
      this.sentenceStr = this.sentenceStr.replace(word, "___");
      this.sentenceForm.addControl(`answer${index}`, this.fb.control(''));
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

    this.sentenceForm = fb.group({data:[]});
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

  async checkAnswer() {
    try {
      this.sentenceForm.patchValue({
        data: this.sentenceArr.map((word: any, index: any) => this.sentenceForm.get(`answer${index}`)?.value || '')
      });
      const result = await this.exerciseService.solveExercise(
        29,
        this.id,
        'sentence',
        this.sentenceForm
      );
      this.success(result);
    } catch (error) {
      console.log(error);
    }
  }


  success(text: string) {
    Swal.fire({
      title: 'Success',
      text: text,
      icon: 'success',
      confirmButtonText: 'Ok',
      width: 600,
      padding: '3em',
      color: '#2B788B',
      background: '#F6F5F4',
    });
  }

}
