import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthHeaderComponent } from './core/components/auth-header/auth-header.component';
import {BearerInterceptor} from "./core/interceptors/bearer.interceptor";
import { NotFoundComponent } from './core/components/not-found/not-found.component';
// import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from './core/components/base-component/base-component.component';
import { ExerciseCardComponent } from './core/components/exercise-card/exercise-card.component';
import {MainModule} from "./main/main.module";
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoaderComponent } from './core/components/loader/loader.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {LoaderInterceptor} from "./core/interceptors/request.interceptor";


export function HttpLoaderFactory(http:HttpClient){
  return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [
        AppComponent,
        AuthHeaderComponent,
        NotFoundComponent,
        BaseComponent,
        LoaderComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        MainModule,
        HttpClientModule,
        AppRoutingModule,
        NoopAnimationsModule,
        SweetAlert2Module.forRoot(),
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),

    ],
    providers: [
      {provide: HTTP_INTERCEPTORS, useClass: BearerInterceptor, multi: true},
      {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
    ],
    exports: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
