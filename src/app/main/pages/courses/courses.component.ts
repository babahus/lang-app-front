import {Component, OnInit} from '@angular/core';
import {CourseService} from "../../../core/services/course.service";
import {LoaderService} from "../../../core/services/loader.service";
import {Course} from "../../models/course.model";
import {Pagination} from "../../models/pagination.model";
import * as fromSelectors from '../../../core/selectors/role-selector';
import Swal from "sweetalert2";
import {Store} from "@ngrx/store";
import {combineLatest} from "rxjs";
import {ProfileService} from "../../../core/services/profile-service.service";
import {ClickOutsideDirective} from "../../../core/directives/click-outside.directive";
import {PseudoCryptService} from "../../../core/services/pseudo-crypt.service";

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent{
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
  public showMyAttachedCourses = true;
  public showCourseDetailModal = false;
  public courses: Course[] = [];
  selectedCourse: null|Course = null;
  public filteredCourses: Course[] = [];
  public pagination: Pagination|null = null;
  pages: number[] = [0];
  public attachedCourses: Course[] = [];
  private studentId!: number | undefined;
  selectedStage: any;
  isCardInfoVisible = false;
  public currentUserRole!: string | undefined;

  constructor(private profileService: ProfileService, private courseService: CourseService, private store: Store, public cryptoService : PseudoCryptService) {
    combineLatest([
      this.profileService.currentUserRole$,
      this.profileService.currentUserId$
    ]).subscribe(([role, userId]) => {
      this.currentUserRole = role;
      this.studentId = userId;

      console.log("User role:", role);
      console.log("User ID:", userId);
      if (this.studentId){
        this.getCourses();
      }
    });
    const encryptedExpiredAt = localStorage.getItem('expired_at');
    if (encryptedExpiredAt){
      const expiredAt = this.cryptoService.decrypt(encryptedExpiredAt);
      const currentDate = new Date();
      const expirationDate = new Date(expiredAt);
      console.log(expirationDate,currentDate)
    }
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
    const showFree = this.showFreeCourses;
    const showPaid = this.showPaidCourses;
    const showAttached = this.showMyAttachedCourses;

    this.filteredCourses = this.courses.filter(course => {
      const isAttached = this.isCourseAttached(course.id);
      const isFree = course.price === 0;
      const isPaid = course.price > 0;

      return (showFree && isFree && !isAttached) ||
        (showPaid && isPaid && !isAttached) ||
        (showAttached && isAttached);
    });
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
        text: (error && error.error && error.error.data) ? error.error.data : "You don't allow to do this action",
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

  closeCardInfo() {
    this.isCardInfoVisible = false;
  }

  closeFilterDetails() {
    this.openDetails = false;
  }

  closeDetailCourseModal(course : Course|null){
    if (this.selectedCourse && course && this.selectedCourse.id == course.id){
      this.showCourseDetailModal = false
    }
    //this.showCourseDetailModal = false
  }
}
