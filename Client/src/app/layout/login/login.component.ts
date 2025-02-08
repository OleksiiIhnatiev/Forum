import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginDto } from '../../dtos/auth/login.dto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public form: FormGroup;

  public get hasEmailRequiredError(): boolean {
    return this.form.get('email')?.hasError('required') ?? false;
  }

  public get hasEmailInvalidError(): boolean {
    return this.form.get('email')?.hasError('email') ?? false;
  }

  public get hasPasswordRequiredError(): boolean {
    return this.form.get('email')?.hasError('required') ?? false;
  }

  public get hasPasswordMinLengthError(): boolean {
    return this.form.get('email')?.hasError('required') ?? false;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<LoginComponent>,
    private snackBar: MatSnackBar
  ) {}

  public ngOnInit(): void {
    this.initializeLoginForm();
  }

  public login(): void {
    if (!this.form.valid) return;

    const loginDto = new LoginDto(
      this.form.value.email,
      this.form.value.password
    );

    this.authService.login(loginDto).subscribe({
      next: () => {
        this.snackBar.open('Login successful', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: () =>
        this.snackBar.open('Login failed', 'Close', { duration: 3000 }),
    });
  }

  private initializeLoginForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
}
