import { Component, OnInit } from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {matchPassword} from "../../../core/validators/passwordValidator";
import {AuthService} from "../../../core/services/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public registerForm: UntypedFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl(null, [
      Validators.required,
      Validators.maxLength(100),
      Validators.minLength(5)
    ]),
    role: new UntypedFormControl(null, [
      Validators.required,
      Validators.maxLength(10),
      Validators.minLength(3)
    ]),
    email: new UntypedFormControl(null, [
      Validators.required,
      Validators.email,
    ]),
    password : new UntypedFormControl(null, [
      Validators.required,
      Validators.minLength(6)
    ]),
    password_confirmation : new UntypedFormControl(null, [
      Validators.required,
      Validators.minLength(6),
    ]),
  }, {
    validators: matchPassword
  });
  constructor(private authService : AuthService) { }

  ngOnInit(): void {
  }

  async onSubmit() {
    return await this.authService.register(this.registerForm);
  }

}
