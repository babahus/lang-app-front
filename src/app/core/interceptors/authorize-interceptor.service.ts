import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import {PseudoCryptService} from "../services/pseudo-crypt.service";
import Swal from "sweetalert2";

@Injectable()
export class AuthorizeInterceptor implements HttpInterceptor {

  constructor(private router: Router, private cryptoService : PseudoCryptService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          const encryptedExpiredAt = localStorage.getItem('expired_at');
          if (encryptedExpiredAt) {
            const expiredAt = this.cryptoService.decrypt(encryptedExpiredAt);
            const currentDate = new Date();
            const expirationDate = new Date(expiredAt);
            console.log(expirationDate,currentDate)
            if (expirationDate <= currentDate) {
              localStorage.clear();
              console.log('here')
              Swal.fire({
                title: 'Error',
                text: 'Your session has expired, please log in again.',
                icon: 'error',
                confirmButtonText: 'Ok',
                width: 600,
                padding: '3em',
                color: '#2B788B',
                background: '#F6F5F4'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate(['/']);
                }
              });
            }
          }
          localStorage.clear();
        }
        return throwError(error);
      })
    );
  }
}

