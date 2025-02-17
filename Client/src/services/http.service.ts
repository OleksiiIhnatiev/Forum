import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly baseApiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public get<T>(
    controller: string,
    action: string,
    parameters: string
  ): Observable<T> {
    const url = `${this.baseApiUrl}/api/${controller}/${action}?${parameters}`;
    return this.httpClient.get<T>(url);
  }

  public post<T>(
    controller: string,
    action: string,
    body: object
  ): Observable<T> {
    const url = `${this.baseApiUrl}/api/${controller}/${action}`;
    return this.httpClient.post<T>(url, body);
  }

  public getFileUrl(fileLink: string): string {
    return `${this.baseApiUrl}/${fileLink}`;
  }
}
