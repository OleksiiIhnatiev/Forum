import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommentsService } from '../../../services/comments.service';
import { CaptchaService } from '../../../services/captcha.service';
import { AuthService } from '../../../services/auth.service';
import { Observable, catchError } from 'rxjs';

@Component({
  selector: 'app-comment-dialog',
  templateUrl: './comment-dialog.component.html',
})
export class CommentDialogComponent {
  commentForm: FormGroup;
  previewImage: string | null = null;
  selectedFile: File | null = null;
  captchaInvalid: boolean = false;
  captchaImage$: Observable<string>;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CommentDialogComponent>,
    private commentsService: CommentsService,
    private captchaService: CaptchaService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: { parentCommentId: string }
  ) {
    const decodedToken = this.authService.decodeToken();
    this.commentForm = this.fb.group({
      userName: [
        { value: decodedToken?.name || 'UserFromToken', disabled: true },
      ],
      email: [
        {
          value:
            decodedToken?.[
              'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
            ] || 'email@example.com',
          disabled: true,
        },
        [Validators.required, Validators.email],
      ],
      homePage: ['', Validators.pattern('https?://.+')],
      text: ['', Validators.required],
      captcha: ['', Validators.required],
    });

    this.captchaImage$ = this.captchaService.generateCaptchaImage$();
  }

  validateCaptcha(): boolean {
    const isValid = this.commentForm.value.captcha === this.captchaService.currentCaptchaText;
    this.captchaInvalid = !isValid;
    return isValid;
  }

  // todo ai consider instead
  validateCaptcha2(): boolean {
    this.captchaInvalid = !(this.commentForm.value.captcha === this.captchaService.currentCaptchaText);
    return !this.captchaInvalid;
  }

  onFileSelected(event: Event): void {
    // todo ai format everywhere
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && file.type.startsWith('image')) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => this.setImagePreview(img);
      };
      reader.readAsDataURL(file);
      this.selectedFile = file;
    }
  }

  // todo ai private should be under public. fix everywhere
  private setImagePreview(img: HTMLImageElement): void {
    const scale = Math.min(320 / img.width, 240 / img.height);
    img.width = img.width * scale;
    img.height = img.height * scale;
    this.previewImage = img.src;
  }

  onSubmit(): void {
    if (this.commentForm.valid && this.validateCaptcha()) {
      const formData = this.prepareFormData();
      this.commentsService
        .addComment(formData)
        .pipe(
          catchError((error) => {
            console.error('Error submitting comment', error);
            throw error;
          })
        )
        .subscribe(() => this.dialogRef.close());
    }
  }

  private prepareFormData() {
    const decodedToken = this.authService.decodeToken();
    return {
      userId: decodedToken?.sub || '',
      text: this.sanitizeHtml(this.commentForm.value.text),
      parentCommentId: this.data?.parentCommentId ?? null,
      homePage: this.commentForm.value.homePage || null,
      imgFile: this.selectedFile,
    };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  // todo ai looks like it sohuld be moved in separate HtmlSanitizerService
  sanitizeHtml(input: string): string {
    return input.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tagName) => {
      return ['a', 'code', 'i', 'strong'].includes(tagName.toLowerCase())
        ? match
        : '';
    });
  }
}
