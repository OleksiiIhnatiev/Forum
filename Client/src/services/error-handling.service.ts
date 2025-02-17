import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError, Observable  } from 'rxjs';
import { ErrorDto } from '../app/dtos/error.dto';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  public handleError<T>() {
    return (source: Observable<T>) =>
      source.pipe(catchError((error: ErrorDto) => throwError(() => error)));
  }
}
