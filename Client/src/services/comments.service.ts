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
  // todo ai it's not an api url
  private static readonly apiUrl = 'http://localhost:3200/api/Comments';
  private readonly controllerName = 'Comments';
  // todo ai public should be above private
  public commentsUpdatedSubject = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient) {}
  // todo ai example
  // constructor(private httpClient: HttpClient, private httpService: HttpService) {}

  // todo ai create specific type instead of anonymous type
  // todo ai method names should correspond backend controller actions
  // todo ai objects (command, queries) names should correspond backend controller actions
  public addComment(formData: {
    userId: string;
    text: string;
    // todo ai why '?'
    parentCommentId?: string;
    homePage?: string;
    imgFile?: File;
  }): Observable<CommentResponseDto> {
    const formDataToSend = new FormData();
    formDataToSend.append('UserId', formData.userId);
    formDataToSend.append('Text', formData.text);
    // todo ai what is the point to check for parentCommentId, homePage?
    if (formData.parentCommentId) {
      formDataToSend.append('ParentCommentId', formData.parentCommentId);
    }
    if (formData.homePage) {
      formDataToSend.append('HomePage', formData.homePage);
    }
    if (formData.imgFile) {
      formDataToSend.append('ImgFile', formData.imgFile, formData.imgFile.name);
    }

    // todo create HttpService. move there httpClient with CRUD operations => get, post, put, delete
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
    // todo ai example
    // this.httpService.get(this.controllerName, '/main-comments', `page=${page}&sortBy=${sortBy}&order=${order}`);
    
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

// todo ai example
class HttpService {
  private readonly baseApiUrl = 'http://localhost:3200/api';

  constructor(private httpClient: HttpClient) {}

  public get<T>(controller: string, action: string, parameters: string): Observable<T> {
    return this.httpClient.get<T>(`${this.baseApiUrl}/${controller}/${action}?${parameters}`);
  }
}

// UrlService.buildUrl(baseUrl: string, routes: string[], queryParameters: {key: string, value: string}[]) {
//   let url = baseUrl;

//   for route routes {
//     url += 'route'
//   }

//   for param queryParameters {
//     url += '&param.key=param.value'
//   }
// }