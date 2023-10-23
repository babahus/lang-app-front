import { Injectable } from '@angular/core';
import {BaseService} from "./base-service/base.service";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {UntypedFormGroup, ValidationErrors} from "@angular/forms";
import {BehaviorSubject, catchError, combineLatest, throwError} from "rxjs";
import * as fromSelectors from '../selectors/role-selector';
import {Store} from "@ngrx/store";

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseService{

  constructor(protected override http: HttpClient,
              protected override route: Router,
              protected override router: ActivatedRoute,
              protected override store: Store
              ) {
    super(http, route, router, store);
    combineLatest([
      this.store.select(fromSelectors.selectRole),
      this.store.select(fromSelectors.selectUserId)
    ]).subscribe(async ([role, userId]) => {
      if (role === undefined || userId === undefined) {
        try {
          const response = await this.getCachedInfo();
          this.currentUserRole.next(response.userRole);
          this.currentUserId.next(response.userId);
        } catch (error) {
          console.error("Error getting cached info:", error);
        }
      } else {
        this.currentUserRole.next(role);
        this.currentUserId.next(userId);
      }
    });
  }

  private currentUserRole = new BehaviorSubject<string | undefined>(undefined);
  private currentUserId = new BehaviorSubject<number | undefined>(undefined);

  public currentUserRole$ = this.currentUserRole.asObservable();
  public currentUserId$ = this.currentUserId.asObservable();

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

  getCachedInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(this.url + '/get-cache-info').pipe(
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
