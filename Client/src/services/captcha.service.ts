import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CaptchaService {
  currentCaptchaText: string = '';

  generateCaptcha(): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    this.currentCaptchaText = Array.from({ length: 6 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');
    return this.currentCaptchaText;
  }

  generateCaptchaImage$(): Observable<string> {
    return of(this.createCaptchaImage(this.generateCaptcha()));
  }

  private createCaptchaImage(text: string): string {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      canvas.width = 150;
      canvas.height = 50;
      context.fillStyle = '#000000';
      context.font = '30px Arial';
      context.fillText(text, 20, 35);
      return canvas.toDataURL();
    }
    return '';
  }
}
