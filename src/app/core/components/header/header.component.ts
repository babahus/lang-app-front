import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  burgerMenu = false;
  authMenu = false;

  toggleMenus() {
    this.burgerMenu = !this.burgerMenu;
    this.authMenu = false;
  }

  toggleAuthMenu() {
    this.authMenu = !this.authMenu;
    this.burgerMenu = false;
  }
  @ViewChild('menu') menuElement!: ElementRef;

  constructor( public authService:AuthService, private router: Router) { }

  redirectToLogin(role: string) {
    this.router.navigate(['/login'], { queryParams: { role } });
  }
  ngOnInit(): void {
  }
}
