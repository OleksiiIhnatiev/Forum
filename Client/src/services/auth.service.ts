import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RegisterDto } from '../app/dtos/auth/register.dto';
import { ResponseDto } from '../app/dtos/auth/response.dto';
import { LoginDto } from '../app/dtos/auth/login.dto';
import { IToken } from '../app/interfaces/token.interface';
import { jwtDecode } from 'jwt-decode';
import { ErrorHandlingService } from './error-handling.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public authStatusSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  private tokenKey = 'authToken';

  constructor(
    private httpService: HttpService,
    private errorHandlingService: ErrorHandlingService
  ) {}

  public isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  public decodeToken(): IToken | null {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      try {
        return jwtDecode<IToken>(token);
      } catch (error) {
        this.errorHandlingService.handleError<IToken>()(
          throwError(() => error)
        );
        return null;
      }
    }
    return null;
  }

  public register(registerDto: RegisterDto): Observable<void> {
    return this.httpService
      .post<void>('Auth', 'Register', registerDto)
      .pipe(this.errorHandlingService.handleError<void>());
  }

  public login(loginDto: LoginDto): Observable<ResponseDto> {
    return this.httpService.post<ResponseDto>('Auth', 'Login', loginDto).pipe(
      tap((response) => {
        this.saveToken(response.token);
        this.authStatusSubject.next(true);
      }),
      this.errorHandlingService.handleError<ResponseDto>()
    );
  }

  public logout(): Observable<void> {
    const token = localStorage.getItem(this.tokenKey);

    return this.httpService.post<void>('Auth', 'Logout', { token }).pipe(
      tap(() => {
        localStorage.removeItem(this.tokenKey);
        this.authStatusSubject.next(false);
      }),
      this.errorHandlingService.handleError<void>()
    );
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
}
