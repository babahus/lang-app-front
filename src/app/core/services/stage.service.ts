import { Injectable } from '@angular/core';
import {BaseService} from "./base-service/base.service";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, throwError} from "rxjs";
import {Store} from "@ngrx/store";
import {UntypedFormGroup, ValidationErrors} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class StageService extends BaseService {

  constructor(
    protected override http: HttpClient,
    protected override route: Router,
    protected override router: ActivatedRoute,
    protected override store: Store
  ) {
    super(http, route, router, store);
  }

  async getStages(courseId: number): Promise<any>{
    return  new Promise((resolve, reject) => {
      this.http.get<any>(this.url + '/stages/' + courseId).pipe(
        catchError((error) => {
          reject(error);
          return throwError(error);
        })
      ).subscribe((data: any) => {
        resolve(data);
      });
    });
  }

  stageCreate(stageCreateForm: UntypedFormGroup, courseId: number){
    return new Promise((resolve, reject) => {
      this.http.post<any>(this.url +  '/stage', {
        title: stageCreateForm.get('title')?.value,
        description: stageCreateForm.get('description')?.value,
        course_id: courseId
      }).pipe(
        catchError((error) => {
          this.handleError(error, stageCreateForm);
          reject(error);
          return throwError(error);
        })
      ).subscribe((data: any) => {
        resolve(data);
      })
    })
  }

  stageEdit(stageId: number, stageEditForm: UntypedFormGroup, courseId: number){
    return new Promise((resolve, reject) => {
      this.http.patch<any>(this.url +  `/stage/${stageId}`, {
        title: stageEditForm.get('title')?.value,
        description: stageEditForm.get('description')?.value,
        course_id: courseId
      }).pipe(
        catchError((error) => {
          this.handleError(error, stageEditForm);
          reject(error);
          return throwError(error);
        })
      ).subscribe((data: any) => {
        resolve(data);
      })
    })
  }

  deleteStage(stageId: number){
    return new Promise((resolve, reject) => {
      this.http.delete<any>(this.url +  `/stage/${stageId}`).pipe(
        catchError((error) => {
          reject(error);
          return throwError(error.error);
        })
      ).subscribe((data: any) => {
        resolve(data);
      })
    })
  }
}
