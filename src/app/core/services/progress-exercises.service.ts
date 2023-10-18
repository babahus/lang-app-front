import { Injectable } from '@angular/core';
import {BaseService} from "./base-service/base.service";
import {Store} from "@ngrx/store";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {catchError, throwError} from "rxjs";
import {ProgressData} from "../../main/models/progress-data";

@Injectable({
  providedIn: 'root'
})
export class ProgressExercisesService extends BaseService{

  constructor(protected override http: HttpClient,
              protected override route: Router,
              protected override router: ActivatedRoute,
              protected override store: Store
  ) {
    super(http, route, router, store);
  }

  getStageProgressByUser(userId : number, stageId : number) : Promise<ProgressData[]>
  {
    return new Promise((resolve, reject) => {
      this.http.get<ProgressData[]>(`${this.url}/users/${userId}/stages/${stageId}/progress`).pipe(
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