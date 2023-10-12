import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { AuthService } from "../services/auth.service";
import { LoaderService } from "../services/loader.service";

@Injectable()
export class BearerInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private loaderService: LoaderService)
  {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.auth.isAuthenticate) {
      let modifiedRequest = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${this.auth.getToken()}`,
        }
      });

      return next.handle(modifiedRequest);
    }

    return next.handle(request);

  }
}
