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

    async ngOnInit(): Promise<void> {
        const roleFromStorage = sessionStorage.getItem('role') || '';

        if (this.auth_code && this.auth_code.code != undefined) {
            if (this.router.snapshot.queryParamMap.has('scope')) {
                await this.authService.sendCodeForSocialAuth(this.auth_code.code, roleFromStorage, 'google');
            } else {
                await this.authService.sendCodeForSocialAuth(this.auth_code.code, roleFromStorage, 'facebook');
            }

            sessionStorage.removeItem('role');
            return;
        }
    }


  async loginWithGoogle(provider: string){
    sessionStorage.setItem('role', this.role);
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

  protected readonly AuthService = AuthService;
}
