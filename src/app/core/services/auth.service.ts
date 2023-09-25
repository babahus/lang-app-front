import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, throwError} from "rxjs";
import {UntypedFormGroup, ValidationErrors} from "@angular/forms";
import {BaseService} from "./base-service/base.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {

  constructor(
    protected override http: HttpClient,
    protected override route: Router,
    protected override router: ActivatedRoute,
  ) {
    super(http, route, router);
  }

  get isAuthenticate() {
    return this.storage.getItem('userToken') !== null;
  }

  public redirectTo(returnUrl?: string | null): any[] {
    return [returnUrl];
  }

  private setToken(api_token: string) {
    this.storage.setItem('userToken', api_token);
  }

  public getToken() {
    return this.storage.getItem('userToken');
  }

  public removeAuthData(){
    this.storage.removeItem('userToken');
    this.storage.removeItem('WSToken')
  }

  public logout() {
    return new Promise(((resolve, reject) => {
      this.http.get<any>(this.url + '/logout', {})
        .pipe(catchError((error) => {
          reject(error);
          return throwError(error)
        })).subscribe((data: any) => {
        this.removeAuthData()
        this.route.navigate(['/']);
        return data;
      });
    }))
  }

  login(loginForm: UntypedFormGroup, role : string): Promise<any> {
    return new Promise(((resolve, reject) => {
      this.http.post<any>(this.url + '/login', {
        email: loginForm.get("email")?.value,
        role: role,
        password: loginForm.get("password")?.value
      }).pipe(catchError((error) => {
        if (error.status === 422) {
          let errorsToForm: ValidationErrors | null = [];
          for (const key of Object.keys(error.error.errors)) {
            errorsToForm[key] = error.error.errors[key][0];
          }
          loginForm.setErrors(errorsToForm)
        } else {
          loginForm.setErrors( {backend: error.error.error});
        }
        reject(error);
        return throwError(error)
      })).subscribe((data:  any) => {
        this.setToken(data.data.token);
        resolve(data.data);
        // todo: check if get param null
        this.route.navigate(this.redirectTo('dashboard'))
      });
    }))
  }

  public register(registerForm: UntypedFormGroup) {
    return new Promise(((resolve, reject) => {
      this.http.post<any>(this.url + '/register', {
        name:     registerForm.get("name")?.value,
        role:     registerForm.get("role")?.value,
        email:    registerForm.get("email")?.value,
        password: registerForm.get("password")?.value,
        password_confirmation: registerForm.get("password_confirmation")?.value,
      }).pipe(catchError((error) => {
        reject(error);
        if (error.status === 422) {
          let errorsToForm: ValidationErrors | null = [];
          for (const key of Object.keys(error.error.errors)) {
            errorsToForm[key] = error.error.errors[key][0];
            //registerForm.setErrors({[key]: error.error.errors[key][0]})
          }
          registerForm.setErrors(errorsToForm)
          console.log(registerForm.getError('email'))
        } else {
          registerForm.setErrors({backend: error.error.error});
        }
        return throwError(error)
      })).subscribe((data: any) => {
        this.setToken(data.data.token);
        resolve(data.data);
      });
    }))
  }

  getLinkForGoogleAuth(role : string){
    return new Promise(((resolve, reject) => {
      return this.http.get(this.url + '/login/google'+'?role='+role )
        .subscribe((data:any) => {
          console.log(data)
          resolve(data.data)
        })
    }))
  }

  sendCodeForGoogleAuth(code : string, role : string){
    return new Promise(((resolve, reject) => {
      return this.http.post(this.url + '/login/google/callback', {
        code: code,
        role: role,
      }).subscribe((data: any) => {
        resolve(data)
        this.setToken(data.data.token);
        this.route.navigate(['/']);
      })
    }))
  }

}
