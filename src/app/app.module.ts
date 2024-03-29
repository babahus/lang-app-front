import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthHeaderComponent } from './core/components/auth-header/auth-header.component';
import {BearerInterceptor} from "./core/interceptors/bearer.interceptor";
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from './core/components/base-component/base-component.component';
import { ExerciseCardComponent } from './core/components/exercise-card/exercise-card.component';
import {MainModule} from "./main/main.module";
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
        AppComponent,
        AuthHeaderComponent,
        NotFoundComponent,
        BaseComponent,
    ],
    imports: [
        BrowserModule,
        MainModule,
        HttpClientModule,
        AppRoutingModule,
        NgbCollapseModule,
        NoopAnimationsModule
    ],
    providers: [
      {provide: HTTP_INTERCEPTORS, useClass: BearerInterceptor, multi: true},
    ],
    exports: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
