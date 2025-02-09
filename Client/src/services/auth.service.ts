import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RegisterDto } from '../app/dtos/auth/register.dto';
import { ResponseDto } from '../app/dtos/auth/response.dto';
import { LoginDto } from '../app/dtos/auth/login.dto';
import { ErrorDto } from '../app/dtos/error.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public authStatusSubject = new BehaviorSubject<boolean>(this.isLoggedIn());

  private static readonly url = 'http://localhost:5124/api/Auth';
  private tokenKey = 'authToken';

  constructor(private httpClient: HttpClient) {}

  public isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  public register(registerDto: RegisterDto): Observable<void> {
    return this.httpClient
      .post<void>(`${AuthService.url}/Register`, registerDto)
      .pipe(this.handleError<void>());
  }

  public login(loginDto: LoginDto): Observable<ResponseDto> {
    return this.httpClient
      .post<ResponseDto>(`${AuthService.url}/Login`, loginDto)
      .pipe(
        tap((response) => {
          this.saveToken(response.token);
          this.authStatusSubject.next(true);
        }),
        this.handleError<ResponseDto>()
      );
  }

  public logout(): Observable<void> {
    const token = localStorage.getItem(this.tokenKey);

    return this.httpClient
      .post<void>(`${AuthService.url}/Logout`, { token })
      .pipe(
        tap(() => {
          localStorage.removeItem(this.tokenKey);
          this.authStatusSubject.next(false);
        }),
        this.handleError<void>()
      );
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private handleError<T>(): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>) =>
      source.pipe(catchError((error: ErrorDto) => throwError(() => error)));
  }
}
