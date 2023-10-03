import { AbstractControl} from '@angular/forms';

export function matchChangePassword(control: AbstractControl): { [key: string]: any } | null {
  const password = control.get('new_password');
  const confirmPassword = control.get('password_confirmation');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { 'passwordMismatch': true };
  }

  return null;
}
