import {Component, OnInit} from '@angular/core';
import {CourseService} from "../../../core/services/course.service";
import {LoaderService} from "../../../core/services/loader.service";
import {Course} from "../../models/course.model";
import {Pagination} from "../../models/pagination.model";
import {HttpClient} from "@angular/common/http";
import Swal from "sweetalert2";

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  openDetails = false;
  isLoading: boolean = false;

  activeStages: { [key: string]: boolean } = {
    stage1: true,
    stage2: false,
    stage3: false,
    stage4: false,
    stage5: false,
    stage6: false,
  };

  public showFreeCourses = true;
  public showPaidCourses = true;
  public showCourseDetailModal = false;
  public courses: Course[] = [];
  selectedCourse: null|Course = null;
  public filteredCourses: Course[] = [];
  public pagination: Pagination|null = null;
  pages: number[] = [0];
  public attachedCourses: Course[] = [];
  private studentId: string | null;
  selectedStage: any;
  isCardInfoVisible = false;

  constructor(private courseService: CourseService) {
    this.studentId = sessionStorage.getItem('id');
  }

  async getCourses(page : number = 1){
    try {
      this.courseService.getCourses(page).then(async (response: any) => {
        this.courses = response.courses;
        this.pagination = response.pagination;
        this.pages = Array.from({length: this.pagination!.last_page}, (_, i) => i + 1)
        this.filteredCourses = [...this.courses]; // initially, show all courses
        this.attachedCourses = await this.courseService.getCoursesByUser(Number(this.studentId));
      }).catch((error) => {
        console.error('Error fetching courses:', error);
      });
      console.log(this.courses);
    } catch (error) {
      console.error(error);
    }
  }

  async ngOnInit(): Promise<void> {
    await this.getCourses();
  }

  openListExercise(){
    this.openDetails = !this.openDetails;
  }

  showFocusStage(type: string) {
    for (const key in this.activeStages) {
      if (key === type) {
        this.activeStages[key] = !this.activeStages[key];
      } else {
        this.activeStages[key] = false;
      }
    }
  }

  filterCourses(event: Event) {
    this.filteredCourses = this.courses.filter(course =>
      (this.showFreeCourses && course.price === 0) ||
      (this.showPaidCourses && course.price > 0)
    );
  }

  async goToPage(url: number | null) {
    if (url) {
      await this.getCourses(url);
    }
  }

  attachCourseToUser(courseId : number){
    this.courseService.attachCourse(Number(this.studentId), courseId).then(async (response: any) => {
      await Swal.fire({
        title: 'Success',
        text: response,
        icon: 'success',
        width: 600,
        padding: '3em',
        color: '#2B788B',
        background: '#F6F5F4'
      });
      this.attachedCourses = await this.courseService.getCoursesByUser(Number(this.studentId));
    }).catch((error) => {
      Swal.fire({
        title: 'Access Denied',
        text: 'Curse is already attached',
        icon: 'error',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        width: 600,
        padding: '3em',
        color: '#2B788B',
        background: '#F6F5F4'
      })
    });
  }

  detachCourseFromUser(courseId : number){
    this.courseService.detachCourse(Number(this.studentId), courseId).then(async (response: any) => {
      await Swal.fire({
        title: 'Success',
        text: response,
        icon: 'success',
        width: 600,
        padding: '3em',
        color: '#2B788B',
        background: '#F6F5F4'
      });
      this.attachedCourses = await this.courseService.getCoursesByUser(Number(this.studentId));
    }).catch((error) => {
      Swal.fire({
        title: 'Access Denied',
        text: 'Curse is already detached',
        icon: 'error',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        width: 600,
        padding: '3em',
        color: '#2B788B',
        background: '#F6F5F4'
      })
    });
  }

  isCourseAttached(courseId: number): boolean {
    if (Array.isArray(this.attachedCourses)) {
      return this.attachedCourses.some(course => course.id === courseId);
    }

    return false;
  }

  openCourseDetailModal(course: Course) {
    this.selectedCourse = course;
    this.showCourseDetailModal = true;
  }

  toggleCheck(index: number) {
    this.selectedCourse!.course_stages.forEach((stage, i) => {
      if (i !== index) {
        stage.isClicked = false;
      }
    });

    this.selectedCourse!.course_stages[index].isClicked = !this.selectedCourse!.course_stages[index].isClicked;
  }
}