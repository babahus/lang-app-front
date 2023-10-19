import {Component, OnInit} from '@angular/core';
import {ExerciseService} from "../../../../core/services/exercise.service";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";
import {Picture} from "../../../models/exercise";
import Swal from "sweetalert2";

@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.css']
})
export class PictureComponent implements OnInit {
  exerciseService: ExerciseService;
  id: string | null | number;
  picture!: Picture;
  selectedOption: string = '';

  constructor(exerciseService: ExerciseService, private route: ActivatedRoute, private fb: FormBuilder) {
    this.exerciseService = exerciseService;
    this.id = this.route.snapshot.params['id'];
  }

  pictureForm = this.fb.group({
    data: this.fb.control('', Validators.required),
  })

  async ngOnInit(): Promise<void> {
    this.picture = await this.exerciseService.getExerciseByTypeAndId('picture_exercise', this.id);
  }

  selectAnswer(text: string) {
    this.selectedOption = text;
  }

  async onSubmit() {
    try {
      this.pictureForm.patchValue({ data: this.selectedOption });
      const result = await this.exerciseService.solveExercise(28, this.id, 'picture_exercise', this.pictureForm);
      this.success(result);
      this.pictureForm.reset();
    } catch (error) {
    }
  }


  success(text:string){
    Swal.fire({
      title: 'Success',
      text: text,
      icon: 'success',
      confirmButtonText: 'Ok',
      width: 600,
      padding: '3em',
      color: '#2B788B',
      background: '#F6F5F4'
    })
  }

}
