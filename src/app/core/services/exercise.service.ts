import { Injectable } from '@angular/core';
import {BaseService} from "./base-service/base.service";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {FormGroup, ValidationErrors} from "@angular/forms";
import {catchError, throwError} from "rxjs";
import {Audit, CompilePhrase, Dictionary} from "../../main/models/exercise";
import {AttachedExercise} from "../../main/models/attached-exercise";

@Injectable({
  providedIn: 'root'
})
export class ExerciseService extends BaseService
{
  private body!: {};
  constructor(protected override http: HttpClient,
              protected override route: Router,
              protected override router: ActivatedRoute,
              )
  {
    super(http, route, router);
  }

  getExercisesByType(strTypeExercise: string): Promise<Audit[]|CompilePhrase[]|Dictionary[]> {
    return new Promise(((resolve, reject) => {
      this.http.get<Audit[]|CompilePhrase[]|Dictionary[]>(this.url + '/exercise/' + strTypeExercise).pipe(catchError((error) => {
        reject(error);
        return throwError(error)
      })).subscribe((data: Audit[]|CompilePhrase[]|Dictionary[]|any) => {
          resolve(data.data);
      });
    }))
  }

    getExerciseByTypeAndId(strTypeExercise: string, id: string | number | null) : Promise<any> {
    return new Promise(((resolve, reject) => {
      this.http.get<any>(this.url + '/exercise/' + strTypeExercise + '/' + id).pipe(catchError((error) => {
        reject(error);
        return throwError(error)
      })).subscribe((data: any) => {
        resolve(data.data);
      });
    }))
  }

  getAttachedExercise() : Promise<AttachedExercise> {
    return new Promise(((resolve, reject) => {
      this.http.get<any>(this.url + '/exercise').pipe(catchError((error) => {
        reject(error);
        return throwError(error)
      })).subscribe((data: AttachedExercise|any) => {
        resolve(data.data[0]);
      });
    }))
  }

  attachExercise(id : number, type : string) : Promise<any> {
    return new Promise(((resolve, reject) => {
      this.http.post<any>(this.url + '/exercise/attach', {
        'id' : id,
        'type' : type
      }).pipe(catchError((error) => {
        reject(error);
        return throwError(error)
      })).subscribe((data: any) => {
        this.route.navigate(['/exercises-my']).then(r => resolve(data.data))
      });
    }))
  }

  solveExercise(id : number|string|null, type : string, data : FormGroup) : Promise<any> {
    if (type == 'compile_phrase')
    {
      this.body = {
        'id' : parseInt(id as string),
        'type' : type,
        'data' : data.get('data')?.value.join(' ')
      }
    }
    return new Promise(((resolve, reject) => {
      this.http.post<any>(this.url + '/exercise/solve', this.body).pipe(catchError((error) => {
        reject(error);
        if (error.status === 422) {
          data.setErrors(error.error.message);
        }
        if (error.status === 400) {
          console.log(error.error.data);
          data.setErrors(error.error.data);
        }
        return throwError(error)
      })).subscribe((data: any) => {
        resolve(data.data);
      });
    }))
  }

}
