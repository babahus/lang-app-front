import {Component, OnInit} from '@angular/core';
import {CourseService} from "../../../../core/services/course.service";
import {CourseData} from "../../../models/course-data";
import Swal from "sweetalert2";

@Component({
  selector: 'app-courses-card',
  templateUrl: './courses-card.component.html',
  styleUrls: ['./courses-card.component.css']
})
export class CoursesCardComponent implements OnInit {
  public attachedCourses: CourseData[] = [];

  constructor(private courseService : CourseService) {
  }

  async ngOnInit(): Promise<void> {
    this.attachedCourses = await this.courseService.getCoursesByUser(Number(sessionStorage.getItem('id')));
  }

  detachCourseFromUser(courseId : number){
    this.courseService.detachCourse(Number(sessionStorage.getItem('id')), courseId).then(async (response: any) => {
      await Swal.fire({
        title: 'Success',
        text: response,
        icon: 'success',
        width: 600,
        padding: '3em',
        color: '#2B788B',
        background: '#F6F5F4'
      });
      this.attachedCourses = await this.courseService.getCoursesByUser(Number(sessionStorage.getItem('id')));
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

}
