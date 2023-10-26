import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, Observable, throwError} from "rxjs";
import {UntypedFormGroup, ValidationErrors} from "@angular/forms";
import {BaseService} from "./base-service/base.service";
import { Store } from '@ngrx/store';
import * as UserActions from '../actions/set-role-id';
import {clearRoleAndId} from "../actions/clear-role-id";
import {PseudoCryptService} from "./pseudo-crypt.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
  constructor(
    protected override http: HttpClient,
    protected override route: Router,
    protected override router: ActivatedRoute,
    protected override store: Store,
    private cryptoService : PseudoCryptService
  ) {
    super(http, route, router, store);
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

  private setExpiredAt(expired_at: string)
  {
    const encryptedExpiredAt = this.cryptoService.encrypt(expired_at);
    this.storage.setItem('expired_at', encryptedExpiredAt)
  }

  public getToken() {
    return this.storage.getItem('userToken');
  }

  public removeAuthData(){
    this.storage.removeItem('userToken');
    this.storage.removeItem('WSToken')
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('id');

    this.store.dispatch(clearRoleAndId());
  }

  public logout() {
    return new Promise((resolve, reject) => {
      this.http.get<any>(this.url + '/logout', {})
        .pipe(catchError((error) => {
          reject(error);
          return throwError(error)
        })).subscribe((data: any) => {
        this.removeAuthData();
        this.route.navigate(['/']);
        resolve(data);
      });
    });
  }

  login(loginForm: UntypedFormGroup, role: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post<any>(this.url + '/login', {
        email: loginForm.get("email")?.value,
        role: role,
        password: loginForm.get("password")?.value
      }).pipe(
        catchError((error) => {
          this.handleError(error, loginForm);
          reject(error);
          return throwError(error);
        })
      ).subscribe((data: any) => {
        this.setToken(data.data.token);
        this.setExpiredAt(data.data.expired_at);
        this.addDataInSessionStorage(data.data.role,data.data.id)
        resolve(data.data);
        this.route.navigate(this.redirectTo('dashboard'));
      });
    });
  }

  public register(registerForm: UntypedFormGroup, role: string) {
    return new Promise((resolve, reject) => {
      this.http.post<any>(this.url + '/register', {
        name: registerForm.get("name")?.value,
        role: role,
        email: registerForm.get("email")?.value,
        password: registerForm.get("password")?.value,
        password_confirmation: registerForm.get("password_confirmation")?.value,
      }).pipe(
        catchError((error) => {
          this.handleError(error, registerForm);
          reject(error);
          return throwError(error);
        })
      ).subscribe((data: any) => {
        this.setToken(data.data.token);
        this.setExpiredAt(data.data.expired_at);
        this.addDataInSessionStorage(data.data.role,data.data.id)
        resolve(data.data);
        this.route.navigate(this.redirectTo('dashboard'));
      });
    });
  }

  forgotPassword(forgotForm: UntypedFormGroup): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post<any>(this.url + '/forgot-password', {
        email: forgotForm.get("email")?.value,
      }).pipe(
        catchError((error) => this.handleError(error, forgotForm))
      ).subscribe((data: any) => {
        resolve(data.data);
      });
    });
  }

  resetPassword(token: string, resetForm: UntypedFormGroup, email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post<any>(this.url + '/reset-password', {
        token: token,
        password: resetForm.get("password")?.value,
        password_confirmation: resetForm.get("password_confirmation")?.value,
        email: email,
      }).pipe(
        catchError((error) => this.handleError(error, resetForm))
      ).subscribe((data: any) => {
        resolve(data.data);
      });
    });
  }

  emailVerification(id: string, hash: string, expires: string, signature: string): Observable<any> {
    const url = `${this.url}/email/verify/${id}/${hash}?expires=${expires}&signature=${signature}`;
    return this.http.get<any>(url);
  }

  getLinkForSocialAuth(role : string, provider: string){
    return new Promise(((resolve, reject) => {
      return this.http.get(this.url + '/login/' + provider +'?role='+role )
        .subscribe((data:any) => {
          resolve(data.data)
        })
    }))
  }

  sendCodeForSocialAuth(code : string, role: string, provider: string){
    return new Promise(((resolve, reject) => {
      return this.http.post(this.url + '/login/' + provider + '/callback', {
        code: code,
        role: role,
      }).subscribe((data: any) => {
        resolve(data)
        this.setToken(data.data.token);
        this.setExpiredAt(data.data.expired_at);
        this.addDataInSessionStorage(data.data.role,data.data.id)
        this.route.navigate(['/']);
      })
    }))
  }

  addDataInSessionStorage(role : string, id : number){
    sessionStorage.setItem('role', role);
    sessionStorage.setItem('id', String(id));

    this.store.dispatch(UserActions.setRoleAndId({ role, id }));
  }

}
