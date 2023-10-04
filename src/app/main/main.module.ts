import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { IndexComponent } from './pages/index/index.component';
import { AboutComponent } from './pages/about/about.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { FooterComponent } from '../core/components/footer/footer.component';
import {HeaderComponent} from "../core/components/header/header.component";
import {DragDropModule} from '@angular/cdk/drag-drop';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import {ReactiveFormsModule} from "@angular/forms";
import {GuestGuard} from "../core/guards/guest.guard";
import {NotFoundComponent} from "../core/components/not-found/not-found.component";
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import {AuthGuard} from "../core/guards/auth.guard";
import { ExercisesComponent } from './pages/exercises/exercises.component';
import {ExerciseCardComponent} from "../core/components/exercise-card/exercise-card.component";
import { ExercisesMyComponent } from './pages/exercises-my/exercises-my.component';
import { ExerciseAttachedCardComponent } from './components/exercise-attached-card/exercise-attached-card.component';
import { MenuNavigationComponent } from './components/menu-navigation/menu-navigation.component';
import { CompilePhraseComponent } from './pages/solve-exercise/compile-phrase/compile-phrase.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import {EmailVerificationComponent} from "./pages/email-verification/email-verification.component";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {ProfileComponent} from "./pages/profile/profile.component";
import {TranslateModule} from "@ngx-translate/core";



const routes: Routes = [
  { path : '', component: IndexComponent},
  { path : 'register', component: RegisterComponent, canActivate: [GuestGuard]},
  { path : 'login', component: LoginComponent, canActivate: [GuestGuard]},
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [GuestGuard]},
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [GuestGuard]},
  { path: 'api/email/verify/:id/:hash', component: EmailVerificationComponent, canActivate: [AuthGuard]},
  {
    path: 'api/login/google/callback',
    component: LoginComponent,
  },
  {
      path: 'api/login/facebook/callback',
      component: LoginComponent,
  },
  { path : 'dashboard', component : DashboardComponent, canActivate : [AuthGuard]},
  { path : 'profile', component : ProfileComponent, canActivate : [AuthGuard]},
  // { path : 'exercises', component : ExercisesComponent, canActivate : [AuthGuard]},
  // { path : 'exercises-my', component : ExercisesMyComponent, canActivate : [AuthGuard]},
  // { path : 'exercises/compile_phrase/:id', component : CompilePhraseComponent, canActivate : [AuthGuard]},
  {
    path : '**', component: NotFoundComponent
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
    RegisterComponent,
    DashboardComponent,
    ExercisesComponent,
    ExerciseCardComponent,
    ExercisesMyComponent,
    ExerciseAttachedCardComponent,
    MenuNavigationComponent,
    CompilePhraseComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    EmailVerificationComponent,
    ProfileComponent
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    ExerciseCardComponent
  ],
    imports: [
        DragDropModule,
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        NgOptimizedImage,
        SweetAlert2Module,
        TranslateModule,
    ]
})
export class MainModule { }
