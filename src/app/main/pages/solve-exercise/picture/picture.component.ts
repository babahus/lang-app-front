import {Component, OnInit} from '@angular/core';
import {ExerciseService} from "../../../../core/services/exercise.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";
import {Picture} from "../../../models/exercise";
import Swal from "sweetalert2";
import {
  BaseSolveExerciseComponent
} from "../../../../core/components/base-solve-exercise/base-solve-exercise.component";
import {CourseService} from "../../../../core/services/course.service";
import {PseudoCryptService} from "../../../../core/services/pseudo-crypt.service";

@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.css']
})
export class PictureComponent extends BaseSolveExerciseComponent implements OnInit {
  picture!: Picture;
  selectedOption: string = '';

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

  pictureForm = this.fb.group({
    data: this.fb.control('', Validators.required),
  })

  async ngOnInit(): Promise<void> {
    try {
      this.picture = await this.exerciseService.getExerciseByTypeAndId('picture_exercise', this.id);
    } catch (error : any){
      this.errorWithRedirect(error!.error.data)
    }
  }

  selectAnswer(text: string) {
    this.selectedOption = text;
  }

  async onSubmit() {
    try {
      this.pictureForm.patchValue({ data: this.selectedOption });
      const result = await this.exerciseService.solveExercise(this.exerciseId, this.id, 'picture_exercise', this.pictureForm);
      this.success(result);
      this.pictureForm.reset();
      if (this.courseId) {
        const queryParams = { data: this.getEncryptedParams(this.stageId, 'showProgressStages')};
        await this.router.navigate(['/course', this.courseId], {
          queryParams: queryParams
        });
      }
    } catch (error) {
    }
  }

}
