import { Component, OnInit } from '@angular/core';
import {FormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {matchPassword} from "../../../core/validators/passwordValidator";
import {AuthService} from "../../../core/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  errorShow: boolean = false;
  selectedRole: string = 'Choose a role';
  isOpen: boolean = false;
  roles: string[] = ['User', 'Teacher'];

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectRole(role: string) {
    this.selectedRole = role;
    this.isOpen = false;
  }

  registerForm = this.fb.group({
      name: this.fb.control('', Validators.compose([Validators.required, Validators.minLength(3)])),
      email: this.fb.control('', Validators.compose([Validators.required, Validators.email])),
      password: this.fb.control('', Validators.compose([Validators.required, Validators.minLength(8),Validators.pattern('^(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]+$')])),
      password_confirmation: this.fb.control('', Validators.compose([Validators.required, Validators.minLength(8),Validators.pattern('^(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]+$')])),
    },
    { validators: matchPassword })
  constructor(private authService : AuthService, private fb: FormBuilder, private router: Router) { }

  redirectToLogin(role: string) {
    this.router.navigate(['/login'], { queryParams: { role } });
  }

  ngOnInit(): void {
  }

  async onSubmit() {
    try {
      const result =  await this.authService.register(this.registerForm, this.selectedRole);
    } catch (error) {
      this.errorShow = true;

      setTimeout(() => {
        this.errorShow = false;
      }, 5000);
    }

  }

}
