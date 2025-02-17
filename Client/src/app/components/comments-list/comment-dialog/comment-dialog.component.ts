import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommentsService } from '../../../../services/comments.service';
import { CaptchaService } from '../../../../services/captcha.service';
import { AuthService } from '../../../../services/auth.service';
import { ErrorHandlingService } from '../../../../services/error-handling.service';
import { Observable } from 'rxjs';
import { HtmlSanitizerService } from '../../../../services/html-sanitizer.service';

@Component({
  selector: 'app-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.scss'],
})
export class CommentDialogComponent {
  public commentForm: FormGroup;
  public previewImage: string | null = null;
  public selectedFile: File | null = null;
  public captchaInvalid: boolean = false;
  public captchaImage$: Observable<string>;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CommentDialogComponent>,
    private commentsService: CommentsService,
    private captchaService: CaptchaService,
    private authService: AuthService,
    private errorHandlingService: ErrorHandlingService,
    private htmlSanitizer: HtmlSanitizerService,
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

  // Приватные методы
  private setImagePreview(img: HTMLImageElement): void {
    const scale = Math.min(320 / img.width, 240 / img.height);
    img.width = img.width * scale;
    img.height = img.height * scale;
    this.previewImage = img.src;
  }

  private prepareFormData() {
    const decodedToken = this.authService.decodeToken();
    return {
      userId: decodedToken?.sub || '',
      text: this.htmlSanitizer.sanitize(this.commentForm.value.text),
      parentCommentId: this.data?.parentCommentId ?? null,
      homePage: this.commentForm.value.homePage || null,
      messageFile: this.selectedFile,
    };
  }

  public validateCaptcha(): boolean {
    const isValid =
      this.commentForm.value.captcha === this.captchaService.currentCaptchaText;
    this.captchaInvalid = !isValid;
    return isValid;
  }

  public onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const allowedImageFormats = ['image/jpeg', 'image/png', 'image/gif'];
      const allowedTextFormat = 'text/plain';

      if (allowedImageFormats.includes(file.type)) {
        this.selectedFile = file;
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            if (img.width > 320 || img.height > 240) {
              this.setImagePreview(img);
            } else {
              this.previewImage = reader.result as string;
            }
          };
          img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
      } else if (file.type === allowedTextFormat) {
        if (file.size > 100 * 1024) {
          alert('The text file cannot be larger than 100 KB.');
          return;
        }
        this.selectedFile = file;
        this.previewImage = null;
      } else {
        this.previewImage = null;
        alert('Only JPG, PNG, GIF, and TXT files are allowed.');
      }
    }
  }

  public onSubmit(): void {
    if (this.commentForm.valid && this.validateCaptcha()) {
      const formData = this.prepareFormData();
      this.commentsService
        .postComment(formData)
        .pipe(this.errorHandlingService.handleError())
        .subscribe(() => this.dialogRef.close());
    }
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
