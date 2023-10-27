import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
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
import {StageData} from "../../models/stage-data";
import {PseudoCryptService} from "../../../core/services/pseudo-crypt.service";
import {BehaviorSubject, combineLatest, filter} from "rxjs";

@Component({
  selector: 'app-course-view',
  templateUrl: './course-view.component.html',
  styleUrls: ['./course-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CourseViewComponent implements OnInit,AfterViewInit{
  courseData: CourseData = {
    title: '',
    description: '',
    id: 0,
    price: 0,
    course_stages: [],
  };

  currentPage: { [key: string]: number } = {};
  totalPages: number = 0;
  errorShow= false;
  showMenuEditForm = false;
  showMenuCreateStage = false;
  showMenuAttachExerciseStage = false;
  isCardInfoVisible = false;
  deleteModalCourse = false;
  showMenuEditStage = false;
  showMenuProgressStages = false;
  dataLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  selectedType: string = '';
  exerciseData: any;
  exerciseTypes: string[] = ['compile_phrase', 'audit', 'pair_exercise', 'picture_exercise', 'sentence'];

  selectedStage: any|StageData;
  public currentUserRole!: string | undefined;
  public stagesProgress: ProgressData[] = [];
  public currentUserId!: number;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private profileService: ProfileService,
    private fb: FormBuilder,
    private router: Router,
    private stageService: StageService,
    private exerciseService: ExerciseService,
    private progressService: ProgressExercisesService,
    private store : Store,
    private cryptoService: PseudoCryptService
  )
  {
    combineLatest([
      this.profileService.currentUserRole$,
      this.profileService.currentUserId$
    ]).subscribe(([role, userId]) => {
      this.currentUserRole = role;
      if (userId){
        this.currentUserId = userId;
      }
    });

    this.currentPage = {
      'compile_phrase': 1,
      'sentence': 1,
      'audit': 1,
      'pair_exercise': 1,
      'picture_exercise': 1
    };
  }

  getEncryptedParams(courseId: number, stageId: number, exerciseId: number): string {
    const paramString = `${courseId},${stageId},${exerciseId}`;
    return this.cryptoService.encrypt(paramString);
  }

  selectStage(stage: any) {
    this.selectedStage = stage;
  }

  handleButtonClick(stage: any, index: string) {
    this.showModalWindow(index);
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
    this.route.params.subscribe(async params => {
      const courseId = params['id'];
      if (courseId) {
        this.fetchCourseData(courseId)
      }
    })
  }

  ngAfterViewInit(): void {
    this.dataLoaded.pipe(
      filter(loaded => loaded)
    ).subscribe(() => {
      this.route.queryParams.subscribe(queryParams => {
        // const stageId = queryParams['stage'];
        // const flag = queryParams['flag'];
        const encryptData = queryParams['data'];

        if (encryptData) {
          const { stage: stageId, flag } = this.getDecryptedParams(encryptData);
          this.showModalWindow(flag);
          let index = this.courseData.course_stages.findIndex(stage => stage.id == Number(stageId));
          let stage = this.courseData.course_stages.find(stage => stage.id == Number(stageId));
          if (stage) {
            stage.isClicked = false;
            this.toggleCheck(index);
            this.getProgressDataForStage(stage);
          }
        }
      });
    });
  }

  getDecryptedParams(encryptedData: string): { stage: string, flag: string } {
    const decryptedData = this.cryptoService.decrypt(encryptedData);
    const splitData = decryptedData.split(',');
    return { stage: splitData[0], flag: splitData[1] };
  }

  async fetchCourseData(courseId: string) {
    try {
      this.courseData = await this.courseService.getCourseDetails(courseId);
      this.dataLoaded.next(true);
    } catch (error:any) {
      this.router.navigate(['/**']);
    }
  }

  async submitCourseEdit(){
    try {
      await this.courseService.courseEdit(this.courseEditForm, this.courseData.id);
      this.success('You have successfully changed this course');
      this.courseData = await this.courseService.getCourseDetails(String(this.courseData.id));
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
      this.courseData = await this.courseService.getCourseDetails(String(this.courseData.id));
      this.stageCreateForm.reset();
      this.showMenuCreateStage = false;
    } catch (error) {
      console.log(error);
    }
  }

  async submitStageEdit(){
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

      this.exerciseData = await this.exerciseService.getExerciseData(type, this.currentPage[this.selectedType]);
      const paginate = this.exerciseData.data.pagination;
      this.currentPage[this.selectedType] = paginate.current_page;
      this.totalPages = paginate.last_page;
    } catch (error) {
      console.log(error);
    }
  }

  goToPage(page: number, type:string) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage[type] = page;
      this.fetchExerciseData(this.selectedType);
    }
  }

  getPages(type:string) {
    const pagesToShow = 5;
    const pages = [];

    const startPage = Math.max(1, this.currentPage[type] - Math.floor(pagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + pagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
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
        this.showMenuAttachExerciseStage = !this.showMenuAttachExerciseStage;
        break;
      case 'showProgressStages':
        this.showMenuProgressStages = !this.showMenuProgressStages;
        break;
      default:
        this.showMenuEditForm = false;
        this.showMenuCreateStage = false;
        this.showMenuAttachExerciseStage = false;
        this.showMenuProgressStages = false;
        this.showMenuEditStage = false;
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
      this.courseData = await this.courseService.getCourseDetails(String(this.courseData.id));
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
    if (stage.isClicked){
        this.selectStage(stage);
        this.stagesProgress = await this.progressService.getStageProgressByUser(this.currentUserId, stage.id);
        console.log(this.stagesProgress)
    }
  }

  isExerciseCompleted(exerciseId : number): boolean {
    const foundProgress = this.stagesProgress.find(progress => progress.exercise === exerciseId);

    return !!foundProgress && foundProgress.user_progress !== null;
  }

  navigateToExercise(exercise: any) {
    if(!this.isExerciseCompleted(exercise['id'])) {
      const link = ['/exercises/'+exercise['type'], exercise['data']['id']];
      const queryParams = { data: this.getEncryptedParams(this.courseData.id, this.selectedStage.id, exercise['id']) };
      this.router.navigate(link, { queryParams: queryParams });
    }
  }

  showErrorModal(message : string, title : string = 'Access Denied'){
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonText: 'Ok',
      width: 600,
      padding: '3em',
      color: '#2B788B',
      background: '#F6F5F4'
    })
  }

  async toggleCheckForUser(index: number) {
    const clickedStage = this.courseData.course_stages[index];

    if (clickedStage.isClicked){
      clickedStage.isClicked =! clickedStage.isClicked;
      return;
    }

    try {
      await this.checkUserProgressForStage(clickedStage);
      this.resetOtherStages(index);
      this.setClickedStage(index);
      await this.getProgressDataForStage(clickedStage);
    } catch (error) {
      this.showErrorModal('You must complete the previous stage to proceed to the next one.');
    }
  }

  async checkUserProgressForStage(stage : StageData) {
    await this.progressService.canUserProceedToNextStage(stage.id);
  }

  resetOtherStages(clickedIndex : number) {
    this.courseData.course_stages.forEach((stage, index) => {
      if (index !== clickedIndex) {
        stage.isClicked = false;
      }
    });
  }

  setClickedStage(index : number) {
    this.courseData.course_stages[index].isClicked = true;
  }


  closeStageInfo(stage : StageData|null) {
    if (stage && this.selectedStage && stage.id == this.selectedStage.id){
      console.log(this.selectedStage)
      this.selectedStage.isClicked = false;
    }
  }

  handleClick(index: number, stage: StageData) {
    this.toggleCheck(index);
    this.selectStage(stage);
  }

}
