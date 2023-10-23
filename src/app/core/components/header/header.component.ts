import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  switchLanguage(language: string) {
    this.translate.use(language);
    if (language === 'en') {
      this.currentLanguage = 'English';
    } else if (language === 'ua') {
      this.currentLanguage = 'Українська';
    } else if (language === 'ru') {
      this.currentLanguage = 'Русский';
    }
  }

  burgerMenu = false;
  authMenu = false;
  languageDropdownOpen = false;
  currentLanguage = 'English';

  toggleMenus() {
    this.burgerMenu = !this.burgerMenu;
    this.authMenu = false;
  }

  toggleLanguageMenu(){
    this.languageDropdownOpen = !this.languageDropdownOpen;
    this.authMenu = !this.authMenu;
  }

  toggleLanguageDropdown() {
    this.languageDropdownOpen = !this.languageDropdownOpen;
    this.authMenu = !this.authMenu;
  }

  toggleAuthMenu() {
    this.authMenu = !this.authMenu;
    this.burgerMenu = false;
  }

  closeMenus() {
    this.burgerMenu = false;
    this.authMenu = false;
    this.languageDropdownOpen = false;
  }
  @ViewChild('menu') menuElement!: ElementRef;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.menuElement.nativeElement.contains(event.target)) {
      this.closeMenus();
    }
  }

  constructor( protected authService:AuthService, protected router: Router, protected translate: TranslateService) {
    this.translate.setDefaultLang('en');
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
