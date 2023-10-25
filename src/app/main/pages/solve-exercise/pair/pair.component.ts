import {Component, OnInit} from '@angular/core';
import {ExerciseService} from '../../../../core/services/exercise.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Pair} from '../../../models/exercise';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {
  BaseSolveExerciseComponent
} from "../../../../core/components/base-solve-exercise/base-solve-exercise.component";
import {PseudoCryptService} from "../../../../core/services/pseudo-crypt.service";
import {CourseService} from "../../../../core/services/course.service";

@Component({
  selector: 'app-pair',
  templateUrl: './pair.component.html',
  styleUrls: ['./pair.component.css'],
})
export class PairComponent extends BaseSolveExerciseComponent implements OnInit {
  pair!: Pair;
  words: string[] = [];
  translations: string[] = [];

  constructor(protected override exerciseService : ExerciseService,
              protected override route: ActivatedRoute,
              protected override cryptoService: PseudoCryptService,
              protected override router: Router,
              protected override courseService : CourseService,
              private fb: FormBuilder
  )
  {
    super(exerciseService, route, cryptoService, router, courseService);
  }

  pairForm = this.fb.group({
    data: this.fb.array([]),
  });

  async ngOnInit(): Promise<void> {
    try {
      this.pair = await this.exerciseService.getExerciseByTypeAndId(
        'pair_exercise',
        this.id
      );
      this.words = this.pair.options.map((option) => option.word);
      this.translations = this.pair.options.map((option) => option.translation);
    } catch (error : any) {
      this.errorWithRedirect(error!.error.data)
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.translations, event.previousIndex, event.currentIndex);
  }

  async checkAnswer() {
    try {
      const dataFormArray = this.words.map((word, index) => {
        const formData = new FormGroup({
          word: new FormControl(word),
          translation: new FormControl(this.translations[index]),
        });
        return formData;
      });

      const dataArray = this.pairForm.get('data') as FormArray;
      dataArray.clear();

      dataFormArray.forEach((formData) => {
        dataArray.push(formData);
      });


      const result = await this.exerciseService.solveExercise(
        this.exerciseId,
        this.id,
        'pair_exercise',
        this.pairForm
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
