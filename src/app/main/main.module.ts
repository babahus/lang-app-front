import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { IndexComponent } from './pages/index/index.component';
import { AboutComponent } from './pages/about/about.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { FooterComponent } from '../core/components/footer/footer.component';
import {HeaderComponent} from "../core/components/header/header.component";
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import {ReactiveFormsModule} from "@angular/forms";
import {GuestGuard} from "../core/guards/guest.guard";
import {NotFoundComponent} from "../core/components/not-found/not-found.component";

const routes: Routes = [
  { path : '', component: IndexComponent},
  { path: 'register', component: RegisterComponent, canActivate : [GuestGuard] },
  { path: 'login', component: LoginComponent, canActivate : [GuestGuard]},
  {
    path: '**', component: NotFoundComponent
  }
];

@NgModule({
  declarations: [
    IndexComponent,
    AboutComponent,
    CategoriesComponent,
    FooterComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent
  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
  ]
})
export class MainModule { }
