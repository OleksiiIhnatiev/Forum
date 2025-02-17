import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegisterDto } from '../../dtos/auth/register.dto';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  public form: FormGroup;
  public hide = true;

  public get hasUsernameRequiredError(): boolean {
    return this.form.get('username').hasError('required');
  }

  public get hasUsernameMinlengthError(): boolean {
    return this.form.get('username').hasError('minlength');
  }

  public get hasEmailRequiredError(): boolean {
    return this.form.get('email').hasError('required');
  }

  public get hasEmailInvalidError(): boolean {
    return this.form.get('email').hasError('email');
  }

  public get hasPasswordRequiredError(): boolean {
    return this.form.get('password').hasError('required');
  }

  public get hasPasswordMinlengthError(): boolean {
    return this.form.get('password').hasError('minlength');
  }

  public get hasPasswordStrongError(): boolean {
    return this.form.get('password').hasError('strongPasswordValidator');
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  public ngOnInit(): void {
    this.initializeRegisterForm();
  }

  public togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }

  public getPasswordVisibilityIcon(): string {
    return this.hide
      ? 'assets/img/icons/eye-hide.png'
      : 'assets/img/icons/eye-show.png';
  }

  public register(): void {
    if (!this.form.valid) {
      return;
    }

    const registerDto = new RegisterDto(
      this.form.value.username,
      this.form.value.email,
      this.form.value.password
    );

    this.authService.register(registerDto).subscribe({
      next: () => {
        this.snackBar.open('Registration successful', 'Close', {
          duration: 3000,
        });
      },
      error: () => {
        this.snackBar.open('Registration failed: ', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  private initializeRegisterForm(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
}
