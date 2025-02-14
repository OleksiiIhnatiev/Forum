import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CommentDto } from '../app/dtos/comments/comment.dto';
import { CommentResponseDto } from '../app/dtos/comments/response.dto';
import { ErrorDto } from '../app/dtos/error.dto';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private static readonly apiUrl = 'http://localhost:3200/api/Comments';
  public commentsUpdatedSubject = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient) {}

  public addComment(formData: {
    userId: string;
    text: string;
    parentCommentId?: string;
    homePage?: string;
    imgFile?: File;
  }): Observable<CommentResponseDto> {
    const formDataToSend = new FormData();
    formDataToSend.append('UserId', formData.userId);
    formDataToSend.append('Text', formData.text);
    if (formData.parentCommentId) {
      formDataToSend.append('ParentCommentId', formData.parentCommentId);
    }
    if (formData.homePage) {
      formDataToSend.append('HomePage', formData.homePage);
    }
    if (formData.imgFile) {
      formDataToSend.append('ImgFile', formData.imgFile, formData.imgFile.name);
    }

    return this.httpClient
      .post<CommentResponseDto>(`${CommentsService.apiUrl}`, formDataToSend)
      .pipe(
        tap(() => {
          this.commentsUpdatedSubject.next(true);
        }),
        this.handleError<CommentResponseDto>()
      );
  }

  public getMainComments(
    page: number,
    sortBy: string,
    order: string
  ): Observable<CommentDto[]> {
    return this.httpClient
      .get<CommentDto[]>(
        `${CommentsService.apiUrl}/main-comments?page=${page}&sortBy=${sortBy}&order=${order}`
      )
      .pipe(this.handleError<CommentDto[]>());
  }

  public getCommentById(id: string): Observable<CommentDto> {
    return this.httpClient
      .get<CommentDto>(`${CommentsService.apiUrl}/${id}`)
      .pipe(this.handleError<CommentDto>());
  }

  private handleError<T>(): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>) =>
      source.pipe(catchError((error: ErrorDto) => throwError(() => error)));
  }
}
