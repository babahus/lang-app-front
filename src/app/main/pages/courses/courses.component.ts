import {Component, OnInit} from '@angular/core';
import {CourseService} from "../../../core/services/course.service";
import {LoaderService} from "../../../core/services/loader.service";
import {Course} from "../../models/course.model";
import {Pagination} from "../../models/pagination.model";
import {HttpClient} from "@angular/common/http";

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
  public courses: Course[] = [];
  public filteredCourses: Course[] = [];
  public pagination: Pagination|null = null;
  pages: number[] = [0];

  constructor(private courseService: CourseService) {
  }

  async ngOnInit(): Promise<void> {
    try {
      this.courseService.getCourses().then((response: any) => {
        this.courses = response.courses;
        this.pagination = response.pagination;
        this.pages = Array.from({ length: this.pagination!.last_page }, (_, i) => i + 1)
        this.filteredCourses = [...this.courses]; // initially, show all courses
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
    this.filteredCourses = this.courses.filter(course =>
      (this.showFreeCourses && course.price === 0) ||
      (this.showPaidCourses && course.price > 0)
    );
  }

  goToPage(url: number | null) {
      if (url) {
        try {
          this.courseService.getCourses(url).then((response: any) => {
            this.courses = response.courses;
            this.pagination = response.pagination;
            this.pages = Array.from({ length: this.pagination!.last_page }, (_, i) => i + 1)
            this.filteredCourses = [...this.courses]; // initially, show all courses
          }).catch((error) => {
            console.error('Error fetching courses:', error);
          });
        } catch (error) {
          console.error(error);
        } finally {
          this.isLoading = false;
        }
      }
  }
}
