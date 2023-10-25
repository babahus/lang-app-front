import {Component, OnInit} from '@angular/core';
import {ExerciseService} from "../../../../core/services/exercise.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Audit} from "../../../models/exercise";
import {FormBuilder, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {PseudoCryptService} from "../../../../core/services/pseudo-crypt.service";
import {CourseService} from "../../../../core/services/course.service";
import {
  BaseSolveExerciseComponent
} from "../../../../core/components/base-solve-exercise/base-solve-exercise.component";

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent extends BaseSolveExerciseComponent implements OnInit {

  audit!: Audit;
  audioElement: HTMLAudioElement;

  constructor(protected override exerciseService : ExerciseService,
              protected override route: ActivatedRoute,
              protected override cryptoService: PseudoCryptService,
              protected override router: Router,
              protected override courseService : CourseService,
              private fb: FormBuilder
  )
  {
    super(exerciseService, route, cryptoService, router, courseService);
    this.audioElement = new Audio();
  }

  audioForm = this.fb.group({
    data: this.fb.control('', Validators.required),
  })

  async ngOnInit(): Promise<void> {
    try {
      this.audit = await this.exerciseService.getExerciseByTypeAndId('audit', this.id);
      this.audioElement.src = this.audit.path;
    } catch (error : any) {
      this.errorWithRedirect(error!.error.data)
    }
  }

  audioPlaying: boolean = false;
  playAudio() {
    if (this.audioPlaying) {
      this.audioElement.pause();
    } else {
      this.audioElement.play();
    }
    this.audioPlaying = !this.audioPlaying;
  }

  async onSubmit() {
    try {
      const result = await this.exerciseService.solveExercise(this.exerciseId,this.id, 'audit', this.audioForm);
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
