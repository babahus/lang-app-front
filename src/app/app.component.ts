import { Component } from '@angular/core';
import {AuthService} from "./core/services/auth.service";
import {LoaderService} from "./core/services/loader.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'lang-app-front';
  public constructor(
    public authService : AuthService,
    public loaderService : LoaderService
  )
  {

  }
}
