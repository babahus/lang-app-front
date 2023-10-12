import {Component, OnInit} from '@angular/core';
import {CourseService} from "../../../core/services/course.service";
import {LoaderService} from "../../../core/services/loader.service";

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
  public courses: any[] = [];
  public filteredCourses: any[] = [];

  constructor(private courseService: CourseService, private loaderService: LoaderService) {
  }

  async ngOnInit(): Promise<void> {
    try {
      this.isLoading = true;
      this.courses = await this.courseService.getCourses();
      this.filteredCourses = [...this.courses]; // initially, show all courses
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
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

}
