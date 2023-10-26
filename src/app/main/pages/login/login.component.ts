import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  FormBuilder,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {AuthService} from "../../../core/services/auth.service";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorShow: boolean = false;
  role: string = '';
  passwordVisible: boolean = false;

  loginForm = this.fb.group({
    email: this.fb.control('', Validators.compose([Validators.required, Validators.email])),
    password: this.fb.control('', Validators.compose([Validators.required, Validators.minLength(8),Validators.pattern('^(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]+$')])),
  })

  private readonly auth_code: any;
  constructor(
    private authService: AuthService,
    private router: ActivatedRoute,
    private fb: FormBuilder,
  ) {
    this.router.queryParams.subscribe(params => {
      this.role = params['role'];
    });
    if (Object.keys(router.snapshot.queryParams).length !== 0) {
      this.auth_code = router.snapshot.queryParams;
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
    async ngOnInit(): Promise<void> {
      console.log(this.auth_code)
      if (this.auth_code && this.auth_code.code != undefined) {
        const state = this.router.snapshot.queryParams['state'];
        if (state) {
          const parsedState = JSON.parse(state);
          this.role = parsedState.role;
        }
        if (this.router.snapshot.queryParamMap.has('scope')) {
          await this.authService.sendCodeForSocialAuth(this.auth_code.code, this.role, 'google');
        } else {
          await this.authService.sendCodeForSocialAuth(this.auth_code.code, this.role, 'facebook');
        }

        return;
      }
    }

  async loginWithGoogle(provider: string){
    const link = await this.authService.getLinkForSocialAuth(this.role, provider);
    window.open(link as string | URL | undefined,"_self")
  }

  async onSubmit() {
    try {
      const result = await this.authService.login(this.loginForm, this.role);
    } catch (error) {
      this.errorShow = true;
      setTimeout(() => {
        this.errorShow = false;
      }, 5000);
    }
  }
}
