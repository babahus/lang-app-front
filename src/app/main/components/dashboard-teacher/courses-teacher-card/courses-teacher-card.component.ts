import {Component, OnInit} from '@angular/core';
import {combineLatest} from "rxjs";
import {CourseData} from "../../../models/course-data";
import {CourseService} from "../../../../core/services/course.service";
import {ProfileService} from "../../../../core/services/profile-service.service";
import {ExerciseService} from "../../../../core/services/exercise.service";
import {TypeData} from "../../../models/courses-teacher";

@Component({
  selector: 'app-courses-teacher-card',
  templateUrl: './courses-teacher-card.component.html',
  styleUrls: ['./courses-teacher-card.component.css']
})
export class CoursesTeacherCardComponent implements OnInit{
  public attachedCourses: CourseData[] = [];
  public currentUserRole!: string | undefined;
  public currentUserId: number | undefined;
  currentPage: number = 1;
  totalPages: number = 0;
  selectedExerciseType: string = '';
  showStages: boolean[] = [];
  showExerciseTypes: boolean[] = [];
  exerciseData: TypeData[] = [];
  showExerciseModal = false;
  constructor(
      private courseService: CourseService,
      private profileService: ProfileService,
      private exerciseService: ExerciseService
  ) {
    this.showStages = new Array(this.attachedCourses.length).fill(false);
    this.showExerciseTypes = new Array(this.attachedCourses.length).fill([]);
  }

  async ngOnInit(): Promise<void> {
    combineLatest([this.profileService.currentUserRole$, this.profileService.currentUserId$]).subscribe(
        ([role, userId]) => {
          this.currentUserRole = role;
          this.currentUserId = userId;
          this.fetchCourses();
        }
    );
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchCourses();
    }
  }

  sortExercisesByType(type: string, stageExercises: any[]) {
    return stageExercises.filter((exercise: any) => exercise.type === type);
  }

  toggleStageList(index: number) {
    this.showStages[index] = !this.showStages[index];
  }

  toggleExerciseTypeList(stageId: number) {
    this.showExerciseTypes[stageId] = !this.showExerciseTypes[stageId];
  }

  selectExerciseType(exerciseType: string, stage: any) {
    this.selectedExerciseType = exerciseType;

    this.exerciseData = stage.stage_exercises.filter(
        (exercise: any) => exercise.type === this.selectedExerciseType
    );
    console.log(this.exerciseData);
    this.showExerciseModal = true;
  }

  getPages() {
    const pagesToShow = 3;
    const pages = [];
    const startPage = Math.max(1, this.currentPage - Math.floor(pagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + pagesToShow - 1);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  async fetchCourses() {
    if (this.currentUserId !== undefined) {
      const coursesData = await this.courseService.getTeacherCourses(this.currentUserId, this.currentPage);
      this.attachedCourses = coursesData.data.courses;
      this.currentPage = coursesData.data.pagination.current_page;
      this.totalPages = coursesData.data.pagination.last_page;
    }
  }
}
