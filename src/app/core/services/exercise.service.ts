import { Injectable } from '@angular/core';
import {BaseService} from "./base-service/base.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {UntypedFormGroup, ValidationErrors} from "@angular/forms";
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

  getAttachedExercise() : Promise<any> {
    return new Promise(((resolve, reject) => {
      this.http.get<any>(this.url + '/exercise').pipe(
        catchError((error) => {
        reject(error);
        return throwError(error)
      })).subscribe((data: any) => {
        resolve(data.data);
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

  solveExercise(id : number|string|null, type : string, data : UntypedFormGroup) : Promise<any> {
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

  //////////////
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

  getExerciseData(type: string): Promise<any>{
    return  new Promise((resolve, reject) => {
      this.http.get(this.url + `/exercise/${type}`).pipe(
        catchError((error) => {
          reject(error);
          return throwError(error);
        })
      ).subscribe((data: any) => {
        resolve(data);
      });
    });
  }

  attachExerciseForStage(stageId: number, courseId: number, exerciseId: number, type: string): Promise<any>{
    return new Promise((resolve, reject) => {
      this.http.post(this.url + '/exercise/attach', {
        id: exerciseId,
        exercise_type: type,
        stage_id: stageId,
        course_id: courseId
      }).pipe(
        catchError((error) => {
          reject(error);
          return throwError(error);
        })
      ).subscribe((data: any) => {
        resolve(data);
      });
    });
  }

  detachExerciseForStage(stageId: number, courseId: number, exerciseId: number, type: string): Promise<any>{
    return new Promise((resolve, reject) => {
      this.http.post(this.url + '/exercise/detach', {
        id: exerciseId,
        exercise_type: type,
        stage_id: stageId,
        course_id: courseId
      }).pipe(
        catchError((error) => {
          reject(error);
          return throwError(error);
        })
      ).subscribe((data: any) => {
        resolve(data);
      });
    });
  }
    createExercise(form: UntypedFormGroup, type: string): Promise<any> {
        return new Promise(((resolve, reject) => {
            const data: any = this.checkTypeExercise(form, type);

            let requestData: any = {};

            if (type === 'compile_phrase') {
                requestData = {
                    data: data.data,
                    type: data.type,
                };
            } else if (type === 'audit') {
                requestData = data;
            } else if (type === 'pair_exercise') {
                requestData = data;
            }
            console.log(requestData);
            this.http.post<any>(this.url + '/exercise', requestData).pipe(catchError((error) => {
                this.handleError(error, form);
                reject(error);
                return throwError(error);
            })).subscribe((data: any) => {
                console.log(data);
                resolve(data.data);
            });
        }));
    }

    createExercisePair(data: any): Promise<any> {
        return new Promise(((resolve, reject) => {
            this.http.post<any>(this.url + '/exercise', data).pipe(catchError((error) => {
                reject(error);
                return throwError(error);
            })).subscribe((responseData: any) => {
                console.log(responseData);
                resolve(responseData.data);
            });
        }));
    }

    createPictureExercise(pictureForm: UntypedFormGroup, type: string): Promise<any> {
        return new Promise(((resolve, reject) => {
            const jsonString = JSON.stringify(pictureForm.get('options')?.value);

            const formData = new FormData();

            formData.append('data', pictureForm.get("pictureFile")?.value);
            formData.append('type', type);
            formData.append('additional_data', jsonString);

            this.http.post<any>(this.url + '/exercise', formData).pipe(catchError((error) => {
                reject(error);
                return throwError(error);
            })).subscribe((responseData: any) => {
                resolve(responseData.data);
            });
        }));
    }

    createSentenceExercise(sentenceForm: UntypedFormGroup, type: string): Promise<any> {
        return new Promise(((resolve, reject) => {
            const jsonString = JSON.stringify(sentenceForm.get('missingWords')?.value);
            this.http.post<any>(this.url + '/exercise',
                {
                  data: sentenceForm.get('phrase')?.value,
                  type: type,
                  additional_data: jsonString,
                }).pipe(catchError((error) => {
                reject(error);
                return throwError(error);
            })).subscribe((responseData: any) => {
                resolve(responseData.data);
            });
        }));
    }


    checkTypeExercise(form: UntypedFormGroup, type: string) {
      let dataExercise: any = {};

      if (type === 'compile_phrase') {
          dataExercise = {
              data: form.get("phrase")?.value,
              type: type,
          };
          return dataExercise;
      } else if (type === 'audit') {
          const formData = new FormData();

          formData.append('data', form.get("auditFile")?.value);
          formData.append('type', type);
          formData.append('additional_data', form.get("auditPhrase")?.value);

          return formData;
      } else if (type === 'pair_exercise') {
          dataExercise = {
              data: form.get("wordPairs")?.value,
              type: type,
          };
          return dataExercise;
      }
  }


}
