import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {matchPassword} from "../../../core/validators/passwordValidator";
import {AuthService} from "../../../core/services/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.maxLength(100),
      Validators.minLength(5)
    ]),
    role: new FormControl(null, [
      Validators.required,
      Validators.maxLength(10),
      Validators.minLength(3)
    ]),
    email: new FormControl(null, [
      Validators.required,
      Validators.email,
    ]),
    password : new FormControl(null, [
      Validators.required,
      Validators.minLength(6)
    ]),
    password_confirmation : new FormControl(null, [
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
