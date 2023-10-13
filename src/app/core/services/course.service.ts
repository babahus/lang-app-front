import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {BaseService} from "./base-service/base.service";
import {catchError, throwError} from "rxjs";
import {UntypedFormGroup, ValidationErrors} from "@angular/forms";

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
  getCourses(): Promise<any>{
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

  private handleError(error: any, form: UntypedFormGroup) {
    if (error.status === 422) {
      let errorsToForm: ValidationErrors | null = {};
      for (const key of Object.keys(error.error.errors)) {
        errorsToForm[key] = error.error.errors[key][0];
      }
      form.setErrors(errorsToForm);
    } else {
      form.setErrors({ backend: error.error.data });
    }

    return throwError(error);
  }

}
