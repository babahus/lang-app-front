import { Component } from '@angular/core';
import {CourseService} from "../../../core/services/course.service";
import {Router} from "@angular/router";
import {AbstractControl, FormBuilder, Validators} from "@angular/forms";
import Swal from "sweetalert2";

function nonNegativeNumberValidator(control: AbstractControl) {
  const value = control.value;
  if (value < 0) {
    return { negativeNumber: true };
  }
  return null;
}

@Component({
  selector: 'app-course-create',
  templateUrl: './course-create.component.html',
  styleUrls: ['./course-create.component.css']
})
export class CourseCreateComponent {
  errorShow: boolean = false;
  constructor(private courseService: CourseService, private router: Router, private fb:FormBuilder) {
  }

  courseForm = this.fb.group({
    title: this.fb.control('', Validators.compose([Validators.required, Validators.minLength(5)])),
    description: this.fb.control('', Validators.compose([Validators.required, Validators.minLength(12)])),
    price: this.fb.control(0, nonNegativeNumberValidator)
  })

  async submitCourse(){
    try {
      const result =  await this.courseService.createCourse(this.courseForm);
      const courseId = result.data.id;
      this.successCreateExercise(courseId);
      this.courseForm.reset();
    } catch (error) {
      this.errorShow = true;

      setTimeout(() => {
        this.errorShow = false;
      }, 5000);
    }
  }

  successCreateExercise(courseId:string) {
    Swal.fire({
      title: 'Success',
      text: 'Your corse has been successfully created',
      icon: 'success',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Go to the created course',
      width: 600,
      padding: '3em',
      color: '#2B788B',
      background: '#F6F5F4'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate([`/course/${courseId}`]);
      }
    });
  }
}
