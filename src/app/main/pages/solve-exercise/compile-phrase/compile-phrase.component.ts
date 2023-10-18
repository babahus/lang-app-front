import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {
  CdkDragDrop, moveItemInArray,
} from "@angular/cdk/drag-drop";
import {ExerciseService} from "../../../../core/services/exercise.service";
import {CompilePhrase} from "../../../models/exercise";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-compile-phrase',
  templateUrl: './compile-phrase.component.html',
  styleUrls: ['./compile-phrase.component.css']
})
export class CompilePhraseComponent implements OnInit{

  public compilePhraseForm: UntypedFormGroup = new UntypedFormGroup({
    data: new UntypedFormControl(null, [
      Validators.required,
    ]),
  });

  exerciseService : ExerciseService;
  compilePhrase! : CompilePhrase;
  compilePhraseArr : string[] = [];
  id! : string | null | number;

  constructor(exerciseService : ExerciseService,
              private route: ActivatedRoute) {
    this.exerciseService = exerciseService;
    this.id = this.route.snapshot.params['id'];
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.compilePhraseForm.get('data')?.value, event.previousIndex, event.currentIndex);
    this.compilePhraseForm.setErrors(null)
  }

  async ngOnInit(): Promise<void> {
    this.compilePhrase = await this.exerciseService.getExerciseByTypeAndId('compile_phrase', this.id);
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
    console.log(this.id);
    console.log(this.compilePhraseForm);
    await this.exerciseService.solveExercise(12 ,this.id, 'compile_phrase', this.compilePhraseForm)
  }
}
