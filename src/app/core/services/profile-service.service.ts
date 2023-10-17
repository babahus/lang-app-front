import { Injectable } from '@angular/core';
import {BaseService} from "./base-service/base.service";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {UntypedFormGroup, ValidationErrors} from "@angular/forms";
import {catchError, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseService{

  constructor(protected override http: HttpClient,
              protected override route: Router,
              protected override router: ActivatedRoute,
              ) {
    super(http, route, router);
  }

  getProfileInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(this.url + '/profile-info').pipe(
        catchError((error) => {
          reject(error);
          return throwError(error);
        })
      ).subscribe((data: any) => {
        resolve(data.data);
      });
    });
  }

  sendEmailVerification(): Promise<any>{
    return new Promise((resolve, reject) => {
      this.http.post<any>(this.url + '/email/verification-notification', {}).pipe(
        catchError((error) => {
          reject(error);
          return throwError(error);
        })
      ).subscribe((data: any) => {
        resolve(data.data);
      });
    });
  }

  changeEmail(emailForm : UntypedFormGroup): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post<any>(this.url + '/change-email',{
        email : emailForm.get("email")?.value,
        }
      ).pipe(
        catchError((error) => {
          this.handleError(error, emailForm);
          reject(error);
          return throwError(error);
        })
      ).subscribe((data: any) => {
        resolve(data.data);
      });
    });
  }

  changePassword(passwordForm : UntypedFormGroup): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post<any>(this.url + '/change-password',{
        current_password : passwordForm.get("current_password")?.value,
        new_password : passwordForm.get("new_password")?.value,
        password_confirmation : passwordForm.get("password_confirmation")?.value,
        }
      ).pipe(
        catchError((error) => {
          this.handleError(error, passwordForm);
          reject(error);
          return throwError(error);
        })
      ).subscribe((data: any) => {
        resolve(data.data);
      });
    });
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