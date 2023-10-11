import {Component, OnInit} from '@angular/core';
import {CourseService} from "../../../core/services/course.service";

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  openDetails = false;
  activeStages: { [key: string]: boolean } = {
    stage1: true,
    stage2: false,
    stage3: false,
    stage4: false,
    stage5: false,
    stage6: false,
  };
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

  courses: any;

  constructor(private courseService: CourseService) {
  }

  ngOnInit(): void {
    this.courseService.getCourses()
      .then((response) => {
        this.courses = response;
      })
      .catch((error) => {
        console.log(error);
      });
  }

}
