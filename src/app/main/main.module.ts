import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { IndexComponent } from './pages/index/index.component';
import { AboutComponent } from './pages/about/about.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { FooterComponent } from '../core/components/footer/footer.component';
import {HeaderComponent} from "../core/components/header/header.component";

const routes: Routes = [
  { path : '', component: IndexComponent},
  { path: 'about', component: AboutComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: '**', redirectTo: ''}
];

@NgModule({
  declarations: [
    IndexComponent,
    AboutComponent,
    CategoriesComponent,
    FooterComponent,
    HeaderComponent
  ],
  exports: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class MainModule { }
