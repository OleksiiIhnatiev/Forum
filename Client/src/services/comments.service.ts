import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface Comment {
  id: string;
  userName: string;
  text: string;
  createdAt: string;
  imgLink?: string;
  email?: string | null;
  replies: Comment[];
}

export interface CommentResponse {
  success: boolean;
  message: string;
  data: Comment;
}

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
    parentCommentId: string | null;
    imgFile: File | null;
  }): Observable<CommentResponse> {
    const formDataToSend = new FormData();
    formDataToSend.append('UserId', formData.userId);
    formDataToSend.append('Text', formData.text);
    if (formData.parentCommentId) {
      formDataToSend.append('ParentCommentId', formData.parentCommentId);
    }
    if (formData.imgFile) {
      formDataToSend.append('ImgFile', formData.imgFile, formData.imgFile.name);
    }

    return this.httpClient
      .post<CommentResponse>(`${CommentsService.apiUrl}`, formDataToSend)
      .pipe(
        tap(() => this.commentsUpdatedSubject.next(true)),
        this.handleError<CommentResponse>()
      );
  }

  public getMainComments(
    page: number,
    sortBy: string,
    order: string
  ): Observable<Comment[]> {
    return this.httpClient
      .get<Comment[]>(
        `${CommentsService.apiUrl}/main-comments?page=${page}&sortBy=${sortBy}&order=${order}`
      )
      .pipe(this.handleError<Comment[]>());
  }

  public getCommentById(id: string): Observable<Comment> {
    return this.httpClient
      .get<Comment>(`${CommentsService.apiUrl}/${id}`)
      .pipe(this.handleError<Comment>());
  }

  private handleError<T>(): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>) =>
      source.pipe(catchError((error) => throwError(() => error)));
  }
}
