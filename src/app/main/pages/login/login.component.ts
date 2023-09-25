import {Component, OnDestroy, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../core/services/auth.service";
import {ActivatedRoute, Params} from "@angular/router";
import {log} from "util";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: UntypedFormGroup = new UntypedFormGroup({
    email: new UntypedFormControl(null, [
      Validators.required,
      Validators.maxLength(100),
      Validators.minLength(5)
    ]),
    password : new UntypedFormControl(null, [
      Validators.required,
      Validators.minLength(6)
    ])
  });
  private readonly auth_code: any;
  public role = 'User'
  constructor(private authService: AuthService,private router: ActivatedRoute) {
    if (Object.keys(router.snapshot.queryParams).length !== 0) {
      this.auth_code = router.snapshot.queryParams;
    }
  }

  async ngOnInit(): Promise<void> {
    if (this.auth_code && this.auth_code.code != undefined && this.router.snapshot.queryParamMap.has('scope')) {
      console.log(this)
      await this.authService.sendCodeForGoogleAuth(this.auth_code.code, this.role);
      //await this.profileService.getUserInfo();
      return;
    }
  }

  async loginWithGoogle(){
    const link = await this.authService.getLinkForGoogleAuth(this.role);
    window.open(link as string | URL | undefined,"_self")
  }

  async onSubmit() {
    return await this.authService.login(this.loginForm, this.role);
  }

}
