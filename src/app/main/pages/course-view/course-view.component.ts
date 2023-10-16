import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CourseService} from "../../../core/services/course.service";
import {CourseData} from "../../models/course-data";
import {FormBuilder, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {StageService} from "../../../core/services/stage.service";
import {ExerciseService} from "../../../core/services/exercise.service";
import {catchError, throwError} from "rxjs";

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
    course_stages: [],
  };

  errorShow= false;
  showImg= false;
  showMenuEditForm = false;
  showMenuCreateStage = false;
  showMenuAttachExerciseStage = true;
  isCardInfoVisible = false;
  deleteModalCourse = false;

  selectedType: string = '';
  exerciseData: any;
  exerciseTypes: string[] = ['compile_phrase', 'audit', 'pair_exercise', 'picture_exercise', 'sentence'];

  selectedStage: any;

  selectStage(stage: any) {
    this.selectedStage = stage;
    console.log(this.selectedStage);
  }

  selectExerciseType(type: string) {
    this.selectedType = type;
    this.fetchExerciseData(type);
  }


  toggleCheck(index: number) {
    this.courseData.course_stages.forEach((stage, i) => {
      if (i !== index) {
        stage.isClicked = false;
      }
    });

    this.courseData.course_stages[index].isClicked = !this.courseData.course_stages[index].isClicked;
  }


  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private fb: FormBuilder,
    private router: Router,
    private stageService: StageService,
    private exerciseService: ExerciseService,
  )
  {}

  courseEditForm = this.fb.group({
    title: this.fb.control('', Validators.compose([Validators.required, Validators.minLength(5)])),
    description: this.fb.control('', Validators.compose([Validators.required, Validators.minLength(12)])),
    price: this.fb.control(0)
  })

  stageCreateForm = this.fb.group({
    title: this.fb.control('', Validators.compose([Validators.required, Validators.minLength(5)])),
    description: this.fb.control('', Validators.compose([Validators.required, Validators.minLength(12)])),
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
    } catch (error:any) {
      this.router.navigate(['/**']);
    }
  }

  async submitCourseEdit(){
    try {
      await this.courseService.courseEdit(this.courseEditForm, this.courseData.id);
      this.success('You have successfully changed this course');
      this.showImg = true;
      this.courseEditForm.reset();
      this.showMenuEditForm = false;
    } catch (error) {
      console.log(error);
    }
  }

  async submitStageCreate(){
    try {
      await this.courseService.stageCreate(this.stageCreateForm, this.courseData.id);
      this.success('You have successfully created this stage');
      this.showImg = true;
      this.stageCreateForm.reset();
      this.showMenuCreateStage = false;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCourse() {
    try {
      await this.courseService.deleteCourse(this.courseData.id);
      this.deleteModalCourse = false;
      Swal.fire({
        title: 'Success',
        text: 'Successfully delete course',
        icon: 'success',
        confirmButtonText: 'Ok',
        width: 600,
        padding: '3em',
        color: '#2B788B',
        background: '#F6F5F4'
      }).then((result) => {
        this.router.navigate(['/courses-create']);
      });
    } catch (error: any) {
      const errorDelete: any = error.error.data;
      this.deleteModalCourse = false;
      Swal.fire({
        title: 'Error 403',
        text: errorDelete.message,
        icon: 'error',
        confirmButtonText: 'Ok',
        width: 600,
        padding: '3em',
        color: '#2B788B',
        background: '#F6F5F4'
      })
    }
  }

  async fetchExerciseData(type: string) {
    try {
      this.selectedType = type;
       this.exerciseData = await this.exerciseService.getExerciseData(type);
       console.log( this.exerciseData);
    } catch (error) {
      console.log(error);
    }
  }


  showModalWindow(index : string){
    if (index === 'editCourse'){
      this.showMenuEditForm = !this.showMenuEditForm;
    } else if (index === 'createStage') {
      this.showMenuCreateStage = !this.showMenuCreateStage;
    } else if (index === 'attachExercise') {
      // const stages =  this.stageService.getStages(this.courseData.id);
      this.showMenuAttachExerciseStage = !this.showMenuAttachExerciseStage;
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


    // async getAllExercise(): Promise<any>{
    //   return new Promise((resolve, reject) => {
    //     this.http.get<any>(this.url + '/exercises/teacher/').pipe(
    //       catchError((error) => {
    //         reject(error);
    //         return throwError(error);
    //       })
    //     ).subscribe((data: any) => {
    //       resolve(data);
    //     });
    //   });
    // }







  selectedFruit: string = '';
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  selectedFruits: string[] = [];

  addSelectedFruit(): void {
    if (this.selectedFruit && !this.selectedFruits.includes(this.selectedFruit)) {
      this.selectedFruits.push(this.selectedFruit);
    }
  }

  removeSelectedFruit(fruit: string): void {
    const index = this.selectedFruits.indexOf(fruit);
    if (index !== -1) {
      this.selectedFruits.splice(index, 1);
    }
  }




}
