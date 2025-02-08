import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Comment {
  id: number;
  userName: string;
  text: string;
  createdAt: string;
  email: string | null; 
  isReply: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private apiUrl = 'http://localhost:5124/api/Comments/main-comments';  

  constructor(private http: HttpClient) {}

  getMainComments(page: number, sortBy: string, order: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}?page=${page}&sortBy=${sortBy}&order=${order}`);
  }

  getCommentById(id: string): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiUrl}/${id}`);
  }
  
}
