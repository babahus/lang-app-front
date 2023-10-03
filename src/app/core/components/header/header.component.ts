import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";

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

  closeMenus() {
    this.burgerMenu = false;
    this.authMenu = false;
  }
  @ViewChild('menu') menuElement!: ElementRef;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.menuElement.nativeElement.contains(event.target)) {
      this.closeMenus();
    }
  }

  constructor( public authService:AuthService, private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeMenus();
      });
  }

  redirectToLogin(role: string) {
    this.router.navigate(['/login'], { queryParams: { role } });
  }
  ngOnInit(): void {
  }
}
