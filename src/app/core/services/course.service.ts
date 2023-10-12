import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {BaseService} from "./base-service/base.service";
import {catchError, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CourseService extends BaseService {

  constructor(
    protected override http: HttpClient,
    protected override route: Router,
    protected override router: ActivatedRoute,
  ) {
    super(http, route, router);
  }

  getCourses(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(this.url + '/course').pipe(
        catchError((error) => {
          reject(error);
          return throwError(error);
        })
      ).subscribe((data: any) => {
        resolve(data.data);
      });
    });
  }

  attachCourse(studentId: number, courseId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post<any>(this.url + '/course', {
        studentId: studentId,
        courseId: courseId,
      }).pipe(
        catchError((error) => {
          reject(error);
          return throwError(error);
        })
      ).subscribe((data: any) => {
        resolve(data.data);
      });
    });
  }
}
