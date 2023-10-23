import { Component, OnInit } from '@angular/core';
import {HeaderComponent} from "../header/header.component";
import {AuthService} from "../../services/auth.service";
import {CourseService} from "../../services/course.service";
import {Store} from "@ngrx/store";
import * as fromSelectors from "../../selectors/role-selector";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {ProfileService} from "../../services/profile-service.service";
import {combineLatest} from "rxjs";

@Component({
  selector: 'app-auth-header',
  templateUrl: './auth-header.component.html',
  styleUrls: ['./auth-header.component.css']
})

export class AuthHeaderComponent extends HeaderComponent implements OnInit
{
  public currentUserRole!: string | undefined;
  constructor(protected override authService : AuthService,
              protected override router : Router,
              protected override translate : TranslateService,
              private profileService : ProfileService,
              private store : Store) {
    super(authService, router, translate);

    combineLatest([
      this.profileService.currentUserRole$,
      this.profileService.currentUserId$
    ]).subscribe(([role, userId]) => {
      this.currentUserRole = role;

      console.log("User role:", role);
      console.log("User ID:", userId);
    });
  }

}
