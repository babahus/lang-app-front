import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {UntypedFormGroup, ValidationErrors} from "@angular/forms";
import {throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  protected url: string = environment.apiUrl;
  protected storage: Storage = window.localStorage;

    constructor(
        protected http: HttpClient,
        protected route: Router,
        protected router: ActivatedRoute,
        protected store: Store) { }

  protected handleError(error: any, form: UntypedFormGroup) {
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
