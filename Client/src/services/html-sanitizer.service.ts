import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HtmlSanitizerService {
  public sanitize(input: string): string {
    return input.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tagName) => {
      return ['a', 'code', 'i', 'strong'].includes(tagName.toLowerCase())
        ? match
        : '';
    });
  }
}
