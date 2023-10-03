import {Component, OnInit} from '@angular/core';
import {ProfileService} from "../../../core/services/profile-service.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {matchPassword} from "../../../core/validators/passwordValidator";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {matchChangePassword} from "../../../core/validators/passwordChangeValidators";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData : any;
  errorData: any;
  showCurrentPassword = false;
  showNewPassword = false;
  showPasswordConfirmation = false;
  errorShow = false;
  errorShow403 : boolean = false;
  savedPassword : boolean = false;
  savedEmail : boolean = false;
  resultChangeEmail: any;
  resultChangePassword: any;

  emailForm = this.fb.group({
    email: this.fb.control('', Validators.compose([Validators.required, Validators.email])),
  });

  passwordForm = this.fb.group({
    current_password: this.fb.control('', Validators.compose([Validators.required, Validators.minLength(8),Validators.pattern('^(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]+$')])),
    new_password: this.fb.control('', Validators.compose([Validators.required, Validators.minLength(8),Validators.pattern('^(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]+$')])),
    password_confirmation: this.fb.control('', Validators.compose([Validators.required, Validators.minLength(8),Validators.pattern('^(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]+$')])),
  },
    { validators: matchChangePassword}
  )
  constructor(private profileService: ProfileService, private fb: FormBuilder, private router: Router) {

  }
  ngOnInit(): void {
    this.profileService.getProfileInfo()
      .then((response) => {
        this.userData = response;
        this.emailForm.patchValue({ email: this.userData.email });
      })
      .catch((error) => {
        this.errorData = error.error.data;
        this.errorShow403 = true;
        this.modalShow();
      });
  }

  async onSubmitEmail() {
    try {
      const result =  await this.profileService.changeEmail(this.emailForm);
      console.log(result);
      this.resultChangeEmail = result;
      this.savedEmail = true;
      setTimeout(() => {
        this.savedEmail = false;
        this.modalShow();
      }, 4000);
    } catch (error) {
      this.errorShow = true;
      setTimeout(() => {
        this.errorShow = false;
      }, 5000);
    }
  }

  async onSubmitPassword() {
    try {
      const result =  await this.profileService.changePassword(this.passwordForm);
      this.savedPassword = true;
      this.passwordForm.reset();
      this.resultChangePassword = result;
      setTimeout(() => {
        this.savedPassword = false;
      }, 4000);
    } catch (error) {
      console.log(error);
    }
  }

  modalShow(){
    Swal.fire({
      title: 'Access Denied',
      text: 'You need to confirm your email to change it',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Send verification email',
      cancelButtonText: 'Cancel',
      width: 600,
      padding: '3em',
      color: '#2B788B',
      background: '#F6F5F4'
    }).then((result) => {
      if (result.isConfirmed) {
        this.profileService.sendEmailVerification().then((response) => {
          Swal.fire({
            title: 'Success',
            text: response,
            icon: 'success',
            width: 600,
            padding: '3em',
            color: '#2B788B',
            background: '#F6F5F4'
          });
          this.router.navigate(['/dashboard']);
        }).catch((error) => {
          console.log(error);
        });
      } else {
        this.router.navigate(['/']);
      }
    });
  }
}
