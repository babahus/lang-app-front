import { Component } from '@angular/core';
import {ExerciseService} from "../../services/exercise.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PseudoCryptService} from "../../services/pseudo-crypt.service";
import {CourseService} from "../../services/course.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-base-solve-exercise',
  templateUrl: './base-solve-exercise.component.html',
  styleUrls: ['./base-solve-exercise.component.css']
})
export class BaseSolveExerciseComponent {

  protected courseId!: number;
  protected stageId!: number;
  protected exerciseId!: number;
  protected id! : string | null | number;

  constructor(protected exerciseService : ExerciseService,
              protected route: ActivatedRoute,
              protected cryptoService: PseudoCryptService,
              protected router: Router,
              protected courseService : CourseService
  )
  {
    this.id = this.route.snapshot.params['id'];
    this.route.queryParams.subscribe(params => {
      try {
        const decrypted = this.cryptoService.decrypt(params['data']);
        [this.courseId, this.stageId, this.exerciseId] = decrypted.split(',').map(val => +val);
        console.log([this.courseId, this.stageId, this.exerciseId]);
      } catch (error) {
        console.error("Error while decoding params :", error);
        this.router.navigate(['/']);
      }
    });

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

  errorWithRedirect(text : string){
    Swal.fire({
      title: 'Error',
      text: text,
      icon: 'error',
      confirmButtonText: 'Ok',
      width: 600,
      padding: '3em',
      color: '#2B788B',
      background: '#F6F5F4'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/']);
      }
    });
  }

}
