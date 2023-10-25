import { Component, OnInit } from '@angular/core';
import { ExerciseService } from "../../../../core/services/exercise.service";
import {ActivatedRoute, Router} from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Sentence } from "../../../models/exercise";
import Swal from "sweetalert2";
import {
  BaseSolveExerciseComponent
} from "../../../../core/components/base-solve-exercise/base-solve-exercise.component";
import {CourseService} from "../../../../core/services/course.service";
import {PseudoCryptService} from "../../../../core/services/pseudo-crypt.service";

@Component({
  selector: 'app-sentence',
  templateUrl: './sentence.component.html',
  styleUrls: ['./sentence.component.css']
})
export class SentenceComponent extends BaseSolveExerciseComponent implements OnInit {
  sentence!: Sentence;
  sentenceStr: string = '';
  sentenceArr: any = [];
  sentenceForm: FormGroup;

  constructor(protected override exerciseService : ExerciseService,
              protected override route: ActivatedRoute,
              protected override cryptoService: PseudoCryptService,
              protected override router: Router,
              protected override courseService : CourseService,
              private fb: FormBuilder
  )
  {
    super(exerciseService, route, cryptoService, router, courseService);
    this.sentenceForm = fb.group({data:[]});
  }

  async ngOnInit(): Promise<void> {
    try {
      this.sentence = await this.exerciseService.getExerciseByTypeAndId(
        'sentence',
        this.id
      );

      this.sentenceStr = this.sentence.sentence_with_gaps;
      this.sentenceArr = this.sentence.correct_answers_json;
      this.changeSentence();
    } catch (error : any) {
      this.errorWithRedirect(error!.error.data)
    }
  }

  changeSentence() {
    this.sentenceArr.forEach((word: any, index: any) => {
      this.sentenceStr = this.sentenceStr.replace(word, "___");
      this.sentenceForm.addControl(`answer${index}`, this.fb.control(''));
    });
    console.log(this.sentenceStr);
  }

  async checkAnswer() {
    try {
      this.sentenceForm.patchValue({
        data: JSON.stringify(this.sentenceArr.map((word: any, index: any) => this.sentenceForm.get(`answer${index}`)?.value || ''))
      });

      const result = await this.exerciseService.solveExercise(
        this.exerciseId,
        this.id,
        'sentence',
        this.sentenceForm
      );
      this.success(result);
      if (this.courseId) {
        const queryParams = { data: this.getEncryptedParams(this.stageId, 'showProgressStages')};
        await this.router.navigate(['/course', this.courseId], {
          queryParams: queryParams
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

}
