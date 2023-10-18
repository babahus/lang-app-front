import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CourseService} from "../../../core/services/course.service";
import {CourseData} from "../../models/course-data";
import {FormBuilder, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {StageService} from "../../../core/services/stage.service";
import {ExerciseService} from "../../../core/services/exercise.service";
import {ProfileService} from "../../../core/services/profile-service.service";
import {Store} from "@ngrx/store";
import * as fromSelectors from "../../../core/selectors/role-selector";
import {ProgressExercisesService} from "../../../core/services/progress-exercises.service";
import {ProgressData} from "../../models/progress-data";

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
  showMenuEditForm = false;
  showMenuCreateStage = false;
  showMenuAttachExerciseStage = false;
  isCardInfoVisible = false;
  deleteModalCourse = false;
  showMenuEditStage = false;
  showMenuProgressStages = false;

  selectedType: string = '';
  exerciseData: any;
  exerciseTypes: string[] = ['compile_phrase', 'audit', 'pair_exercise', 'picture_exercise', 'sentence'];

  selectedStage: any;
  public currentUserRole!: string;
  public stagesProgress: ProgressData[] = [];

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private profileService: ProfileService,
    private fb: FormBuilder,
    private router: Router,
    private stageService: StageService,
    private exerciseService: ExerciseService,
    private progressService: ProgressExercisesService,
    private store : Store
  )
  {
    this.store.select(fromSelectors.selectRole).subscribe(async role => {
      console.log('Your role is')
      console.log(role);
      if (role == undefined) {
        this.currentUserRole = await this.profileService.getCachedInfo();
        console.log(this.currentUserRole);
      } else {
        this.currentUserRole = role;
      }
    });
  }

  selectStage(stage: any) {
    this.selectedStage = stage;
  }

  handleButtonClick(stage: any) {
    this.showModalWindow('editStage');
    this.selectStage(stage);
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

  courseEditForm = this.fb.group({
    title: this.fb.control('', Validators.compose([Validators.required, Validators.minLength(5)])),
    description: this.fb.control('', Validators.compose([Validators.required, Validators.minLength(12)])),
    price: this.fb.control(0)
  })

  stageCreateForm = this.fb.group({
    title: this.fb.control('', Validators.compose([Validators.required, Validators.minLength(5)])),
    description: this.fb.control('', Validators.compose([Validators.required, Validators.minLength(12)])),
  })

  stageEditForm = this.fb.group({
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
      console.log(this.courseData)
    } catch (error:any) {
      this.router.navigate(['/**']);
    }
  }

  async submitCourseEdit(){
    try {
      await this.courseService.courseEdit(this.courseEditForm, this.courseData.id);
      this.success('You have successfully changed this course');
      this.courseEditForm.reset();
      this.showMenuEditForm = false;
    } catch (error) {
      console.log(error);
    }
  }

  async submitStageCreate(){
    try {
      await this.stageService.stageCreate(this.stageCreateForm, this.courseData.id);
      this.success('You have successfully created this stage');
      this.stageCreateForm.reset();
      this.showMenuCreateStage = false;
    } catch (error) {
      console.log(error);
    }
  }

  async submitStageEdit(){
    console.log(this.selectedStage.id);
    console.log(this.courseData.id);
    console.log(this.stageEditForm);
    try {
      await this.stageService.stageEdit(this.selectedStage.id, this.stageEditForm, this.courseData.id);
      this.success('You have successfully changed this stage');
      this.stageEditForm.reset();
      this.showMenuEditStage = false;
    } catch (error:any) {
      const errorDelete: any = error.error.data;
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
      this.selectedExercises = this.filterExercisesByType(type);
      this.exerciseData = await this.exerciseService.getExerciseData(type);
    } catch (error) {
      console.log(error);
    }
  }

  filterExercisesByType(type: string) {
    if (this.selectedStage && this.selectedStage.stage_exercises) {
      return this.selectedStage.stage_exercises
        .filter((exercise: any) => exercise.type === type)
        .map((exercise: any) => exercise.data);
    } else {
      return [];
    }
  }

  showModalWindow(index: string) {
    switch (index) {
      case 'editCourse':
        this.showMenuEditForm = !this.showMenuEditForm;
        break;
      case 'createStage':
        this.showMenuCreateStage = !this.showMenuCreateStage;
        break;
      case 'attachExercise':
        this.showMenuAttachExerciseStage = !this.showMenuAttachExerciseStage;
        break;
      case 'editStage':
        this.showMenuEditStage = !this.showMenuEditStage;
        break;
      case 'showProgressStages':
        this.showMenuProgressStages = !this.showMenuProgressStages;
        break;
      default:
        this.showMenuEditForm = false;
        this.showMenuCreateStage = false;
        this.showMenuAttachExerciseStage = false;
        this.showMenuProgressStages = false;
    }
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

  async attachExerciseForStage(stageId: number, courseId: number, exerciseId: number, type: string) {
    try {
      const result = await this.exerciseService.attachExerciseForStage(
        stageId,
        courseId,
        exerciseId,
        type
      );
    } catch (error) {
      console.log(error);
    }
  }

  async detachExerciseForStage(stageId: number, courseId: number, exerciseId: number, type: string) {
    try {
      const result = await this.exerciseService.detachExerciseForStage(
        stageId,
        courseId,
        exerciseId,
        type
      );
    } catch (error) {
      console.log(error);
    }
  }

  toggleIsClicked(stage: any) {
    stage.isClicked = !stage.isClicked;
    this.exerciseData = null;
    this.selectedExercises = [];
  }

  selectedExercise: any = null;
  selectedExercises: any[] = [];
  addSelectedExercise() {
    if (this.selectedExercise && !this.selectedExercises.includes(this.selectedExercise)) {
      this.attachExerciseForStage(
        this.selectedStage.id,
        this.courseData.id,
        this.selectedExercise.id,
        this.selectedType
      );
      this.selectedExercises.push(this.selectedExercise);
    }
  }

  removeSelectedExercise(exercise: any): void {
    this.detachExerciseForStage(
      this.selectedStage.id,
      this.courseData.id,
      exercise.id,
      this.selectedType
    );
    const index = this.selectedExercises.indexOf(exercise);

    if (index !== -1) {
      this.selectedExercises.splice(index, 1);
    }
  }

  showDeleteCourseMenu(){
    this.deleteModalCourse = !this.deleteModalCourse;
  }

  modalDeleteStage = false;
  showModalDeleteStage(){
    this.modalDeleteStage = !this.modalDeleteStage;
  }

  showDeleteStage(stage: any){
    this.modalDeleteStage = !this.modalDeleteStage;
    this.selectedStage = stage;
  }

  async deleteStage(){
    try {
      await this.stageService.deleteStage(this.selectedStage.id);
      this.selectedStage = [];
      this.modalDeleteStage = false;
      Swal.fire({
        title: 'Success',
        text: 'Successfully delete stage',
        icon: 'success',
        confirmButtonText: 'Ok',
        width: 600,
        padding: '3em',
        color: '#2B788B',
        background: '#F6F5F4'
      })
    } catch (error:any) {
      const errorDelete: any = error.error.data;
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
      this.modalDeleteStage = false;
    }
  }

  async getProgressDataForStage(stage: any) {
    console.log(stage.id);
    this.stagesProgress = await this.progressService.getStageProgressByUser(Number(sessionStorage.getItem('id')), stage.id);
    console.log(this.stagesProgress)
  }

  isExerciseCompleted(exerciseId : number): boolean {
    const foundProgress = this.stagesProgress.find(progress => progress.exercise === exerciseId);

    return !!foundProgress && foundProgress.user_progress !== null;
  }


}
