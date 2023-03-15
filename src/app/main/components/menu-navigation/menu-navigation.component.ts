import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../../../core/components/base-component/base-component.component";
import {AuthService} from "../../../core/services/auth.service";
import { RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-menu-navigation',
  templateUrl: './menu-navigation.component.html',
  styleUrls: ['./menu-navigation.component.css']
})
export class MenuNavigationComponent extends BaseComponent implements OnInit {

  public authService: AuthService;

  constructor(authService : AuthService) {
    super();
    this.authService = authService;
  }

  override ngOnInit(): void {
  }

}
