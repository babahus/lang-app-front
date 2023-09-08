import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ExercisesComponent } from './pages/exercises/exercises.component';
import {ExerciseCardComponent} from "../core/components/exercise-card/exercise-card.component";
import { ExercisesMyComponent } from './pages/exercises-my/exercises-my.component';
import { ExerciseAttachedCardComponent } from './components/exercise-attached-card/exercise-attached-card.component';
import { MenuNavigationComponent } from './components/menu-navigation/menu-navigation.component';
import { CompilePhraseComponent } from './pages/solve-exercise/compile-phrase/compile-phrase.component';

const routes: Routes = [
  { path : '', component: IndexComponent},
  { path : 'register', component: RegisterComponent, canActivate : [GuestGuard] },
  { path : 'login', component: LoginComponent, canActivate : [GuestGuard]},
  {
    path: 'google/code',
    component: LoginComponent,
  },
  { path : 'dashboard', component : DashboardComponent, canActivate : [AuthGuard]},
  { path : 'exercises', component : ExercisesComponent, canActivate : [AuthGuard]},
  { path : 'exercises-my', component : ExercisesMyComponent, canActivate : [AuthGuard]},
  { path : 'exercises/compile_phrase/:id', component : CompilePhraseComponent, canActivate : [AuthGuard]},
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
    CompilePhraseComponent
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
    NgbCollapseModule
  ]
})
export class MainModule { }
