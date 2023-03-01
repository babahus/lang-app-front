import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, throwError} from "rxjs";
import {FormGroup, ValidationErrors} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url: string = environment.apiUrl;
  private storage: Storage = window.localStorage;

  constructor(
    private http: HttpClient,
    private route: Router,
    private router: ActivatedRoute,
  ) { }

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

  login(loginForm: FormGroup): Promise<any> {
    return new Promise(((resolve, reject) => {
      this.http.post<any>(this.url + '/login', {
        email: loginForm.get("email")?.value,
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
        if (this.router.snapshot.queryParamMap.get('returnUrl') != null) {
          const returnUrl = this.router.snapshot.queryParamMap.get('returnUrl');
          this.route.navigate(this.redirectTo(returnUrl))
        }
      });
    }))
  }

  public register(registerForm: FormGroup) {
    return new Promise(((resolve, reject) => {
      this.http.post<any>(this.url + '/register', {
        name:     registerForm.get("name")?.value,
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
}
