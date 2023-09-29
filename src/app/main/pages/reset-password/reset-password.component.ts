import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/services/auth.service";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";
import {matchPassword} from "../../../core/validators/passwordValidator";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit{
  token: string = '';
  email: string = '';
  resultShow: boolean = false;
  errorShow: boolean = true;
  result:string = '';

  resetForm = this.fb.group({
    password: this.fb.control('', Validators.compose([Validators.required, Validators.minLength(8),Validators.pattern('^(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]+$')])),
    password_confirmation: this.fb.control('', Validators.compose([Validators.required, Validators.minLength(8),Validators.pattern('^(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]+$')])),
  },
  { validators: matchPassword })

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
    });
  }

  async  resetPassword() {
    try {
      const response = await this.authService.resetPassword(this.token, this.resetForm, this.email);
      this.result = response;
      this.resultShow = true;
    } catch (error) {

    }
  }
}
