import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MainModule} from "./main/main.module";
import { AuthHeaderComponent } from './core/components/auth-header/auth-header.component';
import {BearerInterceptor} from "./core/interceptors/bearer.interceptor";
import { NotFoundComponent } from './core/components/not-found/not-found.component';

@NgModule({
    declarations: [
        AppComponent,
        AuthHeaderComponent,
        NotFoundComponent,
    ],
    imports: [
        BrowserModule,
        MainModule,
        HttpClientModule,
        AppRoutingModule
    ],
    providers: [
      {provide: HTTP_INTERCEPTORS, useClass: BearerInterceptor, multi: true},
    ],
    exports: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
