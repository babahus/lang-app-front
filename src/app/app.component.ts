import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {AuthService} from "./core/services/auth.service";
import {LoaderService} from "./core/services/loader.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterViewInit{
  title = 'lang-app-front';
  public constructor(
    public authService : AuthService,
    public loaderService : LoaderService,
    private cdr: ChangeDetectorRef
  )
  {

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
  }
}
