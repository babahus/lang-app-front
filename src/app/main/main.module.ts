import { NgModule } from '@angular/core';
import {CommonModule, NgFor, NgOptimizedImage} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { IndexComponent } from './pages/index/index.component';
import { AboutComponent } from './pages/about/about.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { FooterComponent } from '../core/components/footer/footer.component';
import {HeaderComponent} from "../core/components/header/header.component";
import {CdkDrag, CdkDropList, CdkDropListGroup, DragDropModule} from '@angular/cdk/drag-drop';
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
import { CoursesComponent } from './pages/courses/courses.component';
import { ExercisesCreateComponent } from './pages/exercises-create/exercises-create.component';
import { CourseCreateComponent } from './pages/course-create/course-create.component';
import { FormsModule } from '@angular/forms';
import { CourseViewComponent } from './pages/course-view/course-view.component';
import { MaterialModule } from './material/material.module';
import {StoreModule} from "@ngrx/store";
import {userRoleReducer} from "../core/store/user-role-reducer";
import {CanAccessCourseGuard} from "../core/guards/can-access-course.guard";
// import { AttachExerciseStageComponent } from './components/modals/attach-exercise-stage/attach-exercise-stage.component'
import { AuditComponent } from './pages/solve-exercise/audit/audit.component';
import { PairComponent } from './pages/solve-exercise/pair/pair.component';
import { PictureComponent } from './pages/solve-exercise/picture/picture.component';
import {CdkOption} from "@angular/cdk/listbox";
import { CdkListboxModule } from '@angular/cdk/listbox';
import { SentenceComponent } from './pages/solve-exercise/sentence/sentence.component';
import { AttachExerciseComponent } from './pages/attach-exercise/attach-exercise.component';
import { ExercisesCardComponent } from './components/dashboard/exercises-card/exercises-card.component';
import { CoursesCardComponent } from './components/dashboard/courses-card/courses-card.component';
import { ProgressionCardComponent } from './components/dashboard/progression-card/progression-card.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { CoursesTeacherCardComponent } from './components/dashboard-teacher/courses-teacher-card/courses-teacher-card.component';
import {roleGuard} from "../core/guards/role.guard";



const routes: Routes = [
  { path : '', component: IndexComponent},
  { path : 'register', component: RegisterComponent, canActivate: [GuestGuard]},
  { path : 'login', component: LoginComponent, canActivate: [GuestGuard]},
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [GuestGuard]},
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [GuestGuard]},
  { path : 'about', component : AboutComponent},
  { path: 'api/email/verify/:id/:hash', component: EmailVerificationComponent, canActivate: [AuthGuard]},
  {
    path: 'api/login/google/callback',
    component: LoginComponent,
  },
  {
      path: 'api/login/facebook/callback',
      component: LoginComponent,
  },

  { path : 'exercises-create', component : ExercisesCreateComponent, canActivate : [AuthGuard, roleGuard], data: { requiredRole: 'Teacher' }},
  { path : 'courses-create', component : CourseCreateComponent, canActivate : [AuthGuard, roleGuard], data: { requiredRole: 'Teacher' }},
  { path : 'course/:id', component : CourseViewComponent, canActivate : [AuthGuard,CanAccessCourseGuard]},

  { path : 'dashboard', component : DashboardComponent, canActivate : [AuthGuard]},
  { path : 'profile', component : ProfileComponent, canActivate : [AuthGuard]},
  // { path : 'exercises', component : ExercisesComponent, canActivate : [AuthGuard]},
  { path : 'courses', component : CoursesComponent, canActivate : [AuthGuard]},
  { path : 'exercises-my', component : ExercisesMyComponent, canActivate : [AuthGuard]},
  { path : 'exercises/compile_phrase/:id', component : CompilePhraseComponent, canActivate : [AuthGuard]},
  { path : 'exercises/audit/:id', component : AuditComponent, canActivate : [AuthGuard]},
  { path : 'exercises/pair_exercise/:id', component : PairComponent, canActivate : [AuthGuard]},
  { path : 'exercises/picture_exercise/:id', component : PictureComponent, canActivate : [AuthGuard]},
  { path : 'exercises/sentence/:id', component : SentenceComponent, canActivate : [AuthGuard]},
  { path : 'exercises/attach', component : AttachExerciseComponent, canActivate : [AuthGuard, roleGuard], data: { requiredRole: 'User' }},
  {
    path : '**', component: NotFoundComponent
  }
];

@NgModule({
  providers : [CanAccessCourseGuard],
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
    ProfileComponent,
    CoursesComponent,
    ExercisesCreateComponent,
    CourseCreateComponent,
    CourseViewComponent,
    AuditComponent,
    PairComponent,
    PictureComponent,
    SentenceComponent,
    AttachExerciseComponent,
    ExercisesCardComponent,
    CoursesCardComponent,
    ProgressionCardComponent,
    ProgressBarComponent,
    CoursesTeacherCardComponent,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    ExerciseCardComponent
  ],
    imports: [
      CdkListboxModule,
      DragDropModule,
      CdkDropListGroup,
      CdkDropList,
      NgFor,
      CdkDrag,
      CommonModule,
      RouterModule.forChild(routes),
      ReactiveFormsModule,
      NgOptimizedImage,
      SweetAlert2Module,
      FormsModule,
      TranslateModule,
      MaterialModule,
      CdkOption,
      StoreModule.forRoot({ userRole: userRoleReducer }),
    ]
})
export class MainModule { }
