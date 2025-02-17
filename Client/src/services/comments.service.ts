import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpService } from './http.service';
import { IComment } from '../app/interfaces/comment.interface';
import { ICommentResponse } from '../app/interfaces/response.interface';
import { ErrorHandlingService } from './error-handling.service';
import { IPostCommentFormData } from '../app/interfaces/post-comment-form-data.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  public commentsUpdatedSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private httpService: HttpService,
    private errorHandlingService: ErrorHandlingService
  ) {}

  public postComment(
    formData: IPostCommentFormData
  ): Observable<ICommentResponse> {
    const formDataToSend = new FormData();
    formDataToSend.append('UserId', formData.userId);
    formDataToSend.append('Text', formData.text);

    if (formData.parentCommentId) {
      formDataToSend.append('ParentCommentId', formData.parentCommentId);
    }
    if (formData.homePage) {
      formDataToSend.append('HomePage', formData.homePage);
    }
    if (formData.messageFile) {
      formDataToSend.append(
        'MessageFile',
        formData.messageFile,
        formData.messageFile.name
      );
    }

    return this.httpService
      .post<ICommentResponse>('Comments', 'PostComment', formDataToSend)
      .pipe(
        tap(() => {
          this.commentsUpdatedSubject.next(true);
        }),
        this.errorHandlingService.handleError<ICommentResponse>()
      );
  }
  public getMainComments(): Observable<IComment[]> {
    return this.httpService
      .get<IComment[]>('Comments', 'GetMainComments', '')
      .pipe(this.errorHandlingService.handleError<IComment[]>());
  }

  public getCommentWithReplies(id: string): Observable<IComment> {
    return this.httpService
      .get<IComment>('Comments', `GetCommentWithReplies/${id}`, '')
      .pipe(this.errorHandlingService.handleError<IComment>());
  }
}
