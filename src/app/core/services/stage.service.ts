import { Injectable } from '@angular/core';
import {BaseService} from "./base-service/base.service";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StageService extends BaseService {

  constructor(
    protected override http: HttpClient,
    protected override route: Router,
    protected override router: ActivatedRoute,
  ) {
    super(http, route, router);
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
}
