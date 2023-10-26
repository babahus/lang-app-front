import {Component} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ExerciseService} from "../../../core/services/exercise.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-exercises-create',
  templateUrl: './exercises-create.component.html',
  styleUrls: ['./exercises-create.component.css']
})

export class ExercisesCreateComponent {
  compilePhraseModalShow = false;
  auditModalShow = false;
  pairModalShow = false;
  pictureModalShow = false;
  sentenceModalShow = false;
  errorShow = false;
  showCreateExercise = true;
  constructor(private fb: FormBuilder, private router: Router, private exerciseService: ExerciseService) {
  }
    async submitPair() {
        try {
            const jsonString = JSON.stringify(this.wordPairsForm.get('wordPairs')?.value);
            const dataToSend = {
                data: jsonString,
                type: 'pair_exercise',
            };
            const result = await this.exerciseService.createExercisePair(dataToSend);
            this.successCreateExercise();
            this.pairModalShow = false;
        } catch (error) {
            const dataErr:any = error;
            if (dataErr.status === 422) {
                let errorsToForm: ValidationErrors | null = {};
                for (const key of Object.keys(dataErr.error.errors)) {
                    errorsToForm[key] = dataErr.error.errors[key][0];
                }
                this.wordPairsForm.setErrors(errorsToForm);
            } else {
                this.wordPairsForm.setErrors({ backend: dataErr.error.data });
            }
            this.errorShow = true;

            setTimeout(() => {
                this.errorShow = false;
            }, 5000);
        }
    }

    async submitCompilePhrase(){
    try {
      const result =  await this.exerciseService.createExercise(this.compilePhrase, 'compile_phrase');
      this.successCreateExercise();
        this.compilePhrase.reset();
      this.compilePhraseModalShow = false;
    } catch (error) {
      console.log(error);
    }
  }

  async submitAudit(){
      try {
          const result =  await this.exerciseService.createExercise(this.auditForm, 'audit');
          this.successCreateExercise();
          this.auditForm.reset();
          this.auditModalShow = false;
      } catch (error) {
          this.errorShow = true;

          setTimeout(() => {
              this.errorShow = false;
          }, 5000);
      }
  }

    async submitPicture(){
        try {
            const result =  await this.exerciseService.createPictureExercise(this.pictureForm, 'picture_exercise');
            this.successCreateExercise();
            this.pictureForm.reset();
            this.pictureModalShow = false;
        } catch (error:any) {
            if (error.status === 422) {
                let errorsToForm: ValidationErrors | null = {};
                for (const key of Object.keys(error.error.errors)) {
                    errorsToForm[key] = error.error.errors[key][0];
                }
                this.pictureForm.setErrors(errorsToForm);
            } else {
                this.pictureForm.setErrors({ backend: error.error.data });
            }
            this.errorShow = true;
            console.log(this.pictureForm);
            setTimeout(() => {
                this.errorShow = false;
            }, 5000);
        }
    }

  onFileSelect(event: any) {
      const files = event.target.files;
      if (files && files.length > 0) {
          this.auditForm.get('auditFile')?.setValue(files[0]);
      }
  }

    onFileSelectPicture(event: any){
        const files = event.target.files;
        if (files && files.length > 0) {
            this.pictureForm.get('pictureFile')?.setValue(files[0]);
        }
    }

  compilePhrase = this.fb.group({
    phrase: this.fb.control('', Validators.compose([Validators.required, Validators.minLength(8)])),
  })

  auditForm = this.fb.group({
      auditPhrase: this.fb.control('', Validators.compose([Validators.required, Validators.minLength(8)])),
      auditFile: this.fb.control(null, [Validators.required]),
  })

    wordPairsForm = this.fb.group({
        wordPairs: this.fb.array([], Validators.required)
    });

    pictureForm = this.fb.group({
        options: this.fb.array([
            this.createOption(true),
            this.createOption(),
            this.createOption(),
            this.createOption()
        ]),
        pictureFile: this.fb.control(null, [Validators.required])
    });

    sentenceForm = this.fb.group({
        phrase: '',
        missingWords: this.fb.array([]),
    });

    onCheckboxChange(option: FormGroup) {
        this.pictureForm.controls.options['controls'].forEach((item: FormGroup) => {
            item.get('is_correct')?.setValue(item === option);
        });
    }

    createOption(isCorrect: boolean = false): FormGroup {
        return this.fb.group({
            text: '',
            is_correct: isCorrect
        });
    }

    get wordPairs() {
        return this.wordPairsForm.get('wordPairs') as FormArray;
    }

    addWordPair() {
        this.wordPairs.push(this.fb.group({
            word: ['', Validators.required],
            translation: ['', Validators.required]
        }));
    }


    get missingWords() {
        return this.sentenceForm.get('missingWords') as FormArray;
    }

    addMissingWord() {
        const missingWords = this.sentenceForm.get('missingWords') as FormArray;
        missingWords.push(this.fb.control(''));
    }

    removeMissingWord(index: number) {
        const missingWords = this.sentenceForm.get('missingWords') as FormArray;
        missingWords.removeAt(index);
    }

    async createSentence(){
        try {
            const result =  await this.exerciseService.createSentenceExercise(this.sentenceForm, 'sentence');
            this.successCreateExercise();
            this.sentenceForm.reset();
            this.sentenceModalShow = false;
        } catch (error) {
            console.log(error);
            this.errorShow = true;

            setTimeout(() => {
                this.errorShow = false;
            }, 5000);
        }
    }
  successCreateExercise(){
      Swal.fire({
          title: 'Success',
          text: 'Your exercise has been successfully created',
          icon: 'success',
          confirmButtonText: 'Ok',
          width: 600,
          padding: '3em',
          color: '#2B788B',
          background: '#F6F5F4'
      })
  }
}
