import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {
  CdkDragDrop, moveItemInArray,
} from "@angular/cdk/drag-drop";
import {ExerciseService} from "../../../../core/services/exercise.service";
import {CompilePhrase} from "../../../models/exercise";
import {ActivatedRoute, Router} from "@angular/router";
import {PseudoCryptService} from "../../../../core/services/pseudo-crypt.service";
import {
  BaseSolveExerciseComponent
} from "../../../../core/components/base-solve-exercise/base-solve-exercise.component";
import Swal from "sweetalert2";
import {CourseService} from "../../../../core/services/course.service";

@Component({
  selector: 'app-compile-phrase',
  templateUrl: './compile-phrase.component.html',
  styleUrls: ['./compile-phrase.component.css']
})
export class CompilePhraseComponent extends BaseSolveExerciseComponent implements OnInit{

  public compilePhraseForm: UntypedFormGroup = new UntypedFormGroup({
    data: new UntypedFormControl(null, [
      Validators.required,
    ]),
  });

  compilePhrase! : CompilePhrase;
  compilePhraseArr : string[] = [];

  constructor(protected override exerciseService : ExerciseService,
              protected override route: ActivatedRoute,
              protected override cryptoService: PseudoCryptService,
              protected override router: Router,
              protected override courseService : CourseService
  )
  {
    super(exerciseService, route, cryptoService, router, courseService);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.compilePhraseForm.get('data')?.value, event.previousIndex, event.currentIndex);
    this.compilePhraseForm.setErrors(null)
  }

  async ngOnInit(): Promise<void> {
    try {
      this.compilePhrase = await this.exerciseService.getExerciseByTypeAndId('compile_phrase', this.id);
    } catch (error : any) {
      this.errorWithRedirect(error!.error.data)
    }
    console.log(this.compilePhrase);
    let shuffledArray = this.compilePhrase.phrase.split( ' ');
    let different = false;
    this.compilePhraseForm.get('data')?.setValue([...shuffledArray]);

    while (!different) {
      this.compilePhraseForm.get('data')?.value.sort(() => Math.random() - 0.5);
      different = !this.compilePhraseForm.get('data')?.value.every((value: string, index: number) => value === shuffledArray[index]);
    }
  }

  async onSubmit() {
    try {
      const data = await this.exerciseService.solveExercise(this.exerciseId, this.id, 'compile_phrase', this.compilePhraseForm);
      this.success(data);
      if (this.courseId) {
        const queryParams = { data: this.getEncryptedParams(this.stageId, 'showProgressStages')};
        await this.router.navigate(['/course', this.courseId], {
          queryParams: queryParams
        });
      } else {
        await this.router.navigate(['/dashboard'])
      }
    } catch (error : any){
      console.log(this.compilePhraseForm);
    }
  }
}
