import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../core/services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [
      Validators.required,
      Validators.maxLength(100),
      Validators.minLength(5)
    ]),
    password : new FormControl(null, [
      Validators.required,
      Validators.minLength(6)
    ])
  });
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  async onSubmit() {
    return await this.authService.login(this.loginForm);
  }

}
