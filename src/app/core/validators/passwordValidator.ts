import { AbstractControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

export function matchPassword(control: AbstractControl): { [key: string]: any } | null {
  const password = control.get('password');
  const confirmPassword = control.get('password_confirmation');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { 'passwordMismatch': true };
  }

  return null;
}
