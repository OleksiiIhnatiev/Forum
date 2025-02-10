import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommentsService } from '../../../services/comments.service';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  name: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': string;
  sub: string;
}

@Component({
  selector: 'app-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.css'],
})
export class CommentDialogComponent {
  commentForm: FormGroup;
  previewImage: string | null = null;
  selectedFile: File | null = null;
  sanitizedText: string = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CommentDialogComponent>,
    private commentsService: CommentsService,
    @Inject(MAT_DIALOG_DATA) public data: { parentCommentId: string }
  ) {
    const decodedToken = this.getDecodedToken();
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
    });
  }

  private getDecodedToken(): DecodedToken | undefined {
    const token = localStorage.getItem('authToken');
    if (token) {
      return jwtDecode<DecodedToken>(token);
    }
    return undefined;
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && file.type.startsWith('image')) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          if (img.width > 320 || img.height > 240) {
            const scale = Math.min(320 / img.width, 240 / img.height);
            img.width = img.width * scale;
            img.height = img.height * scale;
          }
          this.previewImage = img.src;
        };
      };
      reader.readAsDataURL(file);
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.commentForm.valid) {
      const formData = {
        userId: this.getDecodedToken()?.sub || '',
        text: this.sanitizeHtml(this.commentForm.value.text),
        parentCommentId: this.data.parentCommentId,
        imgFile: this.selectedFile,
      };

      this.sanitizedText = this.sanitizeHtml(this.commentForm.value.text);

      this.commentsService.addComment(formData).subscribe({
        next: () => this.dialogRef.close(),
        error: () => console.error('Error submitting comment'),
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  sanitizeHtml(input: string): string {
    return input.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tagName) => {
      if (['a', 'code', 'i', 'strong'].includes(tagName.toLowerCase())) {
        return match;
      }
      return '';
    });
  }
}
