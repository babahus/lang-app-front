import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {BaseService} from "./base-service/base.service";
import {catchError, throwError} from "rxjs";
import {UntypedFormGroup, ValidationErrors} from "@angular/forms";
import {Store} from "@ngrx/store";

@Injectable({
  providedIn: 'root'
})
export class CourseService extends BaseService {

  constructor(
    protected override http: HttpClient,
    protected override route: Router,
    protected override router: ActivatedRoute,
    protected override store: Store
  ) {
    super(http, route, router, store);
  }

  getCourses(page : number = 1): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(this.url + '/course?page='+page).pipe(
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
      this.http.post<any>(this.url + '/course/attach', {
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

  getCourseDetails(courseId: string): Promise<any> {
    return  new Promise((resolve, reject) => {
      this.http.get<any>(this.url + '/course/' + courseId).pipe(
          catchError((error) => {
            reject(error);
            return throwError(error);
          })
      ).subscribe((data: any) => {
        resolve(data.data);
      });
    });
  }

  createCourse(courseForm: UntypedFormGroup): Promise<any>{
    return new Promise((resolve, reject) => {
      this.http.post<any>(this.url + '/course', {
        title: courseForm.get('title')?.value,
        description: courseForm.get('description')?.value,
        price: courseForm.get('price')?.value
      }).pipe(
          catchError((error) => {
            this.handleError(error, courseForm);
            console.log(error);
            reject(error);
            return throwError(error);
          })
      ).subscribe((data: any) => {
        console.log(data);
        resolve(data);
      })
    })
  }

  deleteCourse(courseId: number){
    return new Promise((resolve, reject) => {
      this.http.delete<any>(this.url +  `/course/${courseId}`).pipe(
        catchError((error) => {
          reject(error);
          return throwError(error.error);
        })
      ).subscribe((data: any) => {
        resolve(data);
      })
    })
  }

  detachCourse(studentId: number, courseId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post<any>(this.url + '/course/detach', {
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

  getCoursesByUser(studentId: number, page: number = 1): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(this.url + '/courses/user/' + studentId).pipe(
        catchError((error) => {
          reject(error);
          return throwError(error);
        })
      ).subscribe((data: any) => {
        resolve(data.data.courses);
      });
    });
  }

  courseEdit(courseEditForm: UntypedFormGroup, courseId: number){
    return new Promise((resolve, reject) => {
      this.http.patch<any>(this.url +  `/course/${courseId}`, {
        title: courseEditForm.get('title')?.value,
        description: courseEditForm.get('description')?.value,
        price: courseEditForm.get('price')?.value
      }).pipe(
          catchError((error) => {
            this.handleError(error, courseEditForm);
            reject(error);
            return throwError(error);
          })
      ).subscribe((data: any) => {
        resolve(data);
      })
    })
  }

  checkIfUserIsCreator(courseId : number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(this.url + `/course/${courseId}/is-creator`).pipe(
        catchError((error) => {
          reject(error);
          return throwError(error);
        })
      ).subscribe((data: any) => {
        resolve(data.data);
      });
    });
  }

  checkIfUserAttachedToCourse(courseId : number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(this.url + `/course/${courseId}/is-attached`).pipe(
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
