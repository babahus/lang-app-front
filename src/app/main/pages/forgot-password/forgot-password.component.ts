import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/services/auth.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotForm = this.fb.group({
    email: this.fb.control('', Validators.compose([Validators.required, Validators.email])),
  })
  errorShow: boolean = false;
  resultShow: boolean = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
  ) {

  }

  async onSubmit() {
    try {
      const response = await this.authService.forgotPassword(this.forgotForm);
      this.resultShow = true;
    } catch (error) {
      this.errorShow = true;
    }
  }
}
