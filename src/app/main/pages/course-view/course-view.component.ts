import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CourseService} from "../../../core/services/course.service";
import {CourseData} from "../../models/courseData";
import {FormBuilder, Validators} from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: 'app-course-view',
  templateUrl: './course-view.component.html',
  styleUrls: ['./course-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CourseViewComponent implements OnInit{
  courseData: CourseData = {
    title: '',
    description: '',
    id: 0,
    price: 0,
    course_stages: []
  };

  errorShow= false;
  showImg= true;
  showMenuEditForm = false;
  showMenuDeleteForm = false;
  showMenuCreateStage = false;
  isCardInfoVisible = false;
  constructor(private route: ActivatedRoute, private courseService: CourseService, private fb: FormBuilder) {
  }

  courseEditForm = this.fb.group({
    title: this.fb.control('', Validators.compose([Validators.required, Validators.minLength(5)])),
    description: this.fb.control('', Validators.compose([Validators.required, Validators.minLength(12)])),
    price: this.fb.control(0)
  })

  ngOnInit() {
    this.route.params.subscribe(params => {
      const courseId = params['id'];
      if (courseId) {
        this.fetchCourseData(courseId);
      }
    });
  }

  async fetchCourseData(courseId: string) {
    try {
      this.courseData =  await this.courseService.getCourseDetails(courseId);
    } catch (error) {
      console.log(error);
    }
  }

  async submitCourseEdit(){
    try {
      const result =  await this.courseService.courseEdit(this.courseEditForm, this.courseData.id);
      this.successUpdatedExercise();
      this.showImg = true;
      this.showMenuEditForm = false;
    } catch (error) {
      console.log(error);
    }
  }

  editCourse(index : string){
    if (index === 'editCourse'){
      this.showMenuEditForm = !this.showMenuEditForm;
    } else if (index === 'createStage') {
      this.showMenuCreateStage = !this.showMenuCreateStage;
    }

    this.showImg = !this.showImg;
  }

  decrementPrice() {
    const currentPrice:any = this.courseEditForm.get('price')?.value;
    if (currentPrice > 0) {
      this.courseEditForm.get('price')?.setValue(currentPrice - 1);
    }
  }

  incrementPrice() {
    const currentPrice:any = this.courseEditForm.get('price')?.value;
    this.courseEditForm.get('price')?.setValue(currentPrice + 1);
  }

  toggleCardVisibility() {
    this.isCardInfoVisible = !this.isCardInfoVisible;
  }

  successUpdatedExercise(){
    Swal.fire({
      title: 'Success',
      text: 'You have successfully changed this course',
      icon: 'success',
      confirmButtonText: 'Ok',
      width: 600,
      padding: '3em',
      color: '#2B788B',
      background: '#F6F5F4'
    })
  }
}
