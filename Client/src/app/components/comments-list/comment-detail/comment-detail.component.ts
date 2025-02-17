import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { IComment } from '../../../interfaces/comment.interface';
import { CommentsService } from '../../../../services/comments.service';
import { CommentDialogComponent } from '../comment-dialog/comment-dialog.component';
import { ImageDialogComponent } from '../comment-detail/image-dialog/image-dialog.component';
import { AuthService } from '../../../../services/auth.service';
import { RegistrationComponent } from '../../registration/registration.component';
import { HttpService } from '../../../../services/http.service';

@Component({
  selector: 'app-comment-detail',
  templateUrl: './comment-detail.component.html',
  styleUrls: ['./comment-detail.component.scss'],
})
export class CommentDetailComponent implements OnInit {
  @Input() comment: IComment | null = null;
  public isLoading: boolean = true;
  public rootComment: IComment = {} as IComment;

  public get userName(): string {
    return this.rootComment.userName || this.comment?.userName || '';
  }

  public get createdAt(): string {
    return this.rootComment.createdAt || this.comment?.createdAt || '';
  }

  public get commentText(): string {
    return this.rootComment.text || this.comment?.text || '';
  }

  public get imgSrc(): string {
    return this.httpService.getImageUrl(this.fileLink);
  }

  public get fileLink(): string {
    return this.rootComment.fileLink || this.comment?.fileLink || '';
  }

  public get homePage(): string {
    return this.rootComment.homePage || this.comment?.homePage || '';
  }

  public get commentId(): string {
    return this.rootComment.id || this.comment?.id || '';
  }

  public get replies(): IComment[] {
    return this.rootComment.replies || this.comment?.replies || [];
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly commentsService: CommentsService,
    private readonly dialog: MatDialog,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly httpService: HttpService
  ) {}

  public ngOnInit(): void {
    if (!this.comment) {
      const commentId = this.route.snapshot.paramMap.get('id');
      if (commentId) {
        this.loadComment(commentId);
      }
    } else {
      this.isLoading = false;
    }

    this.commentsService.commentsUpdatedSubject.subscribe((updated) => {
      if (updated && this.rootComment) {
        this.reloadAllComments();
      }
    });
  }

  public openTextFileDialog(fileLink: string): void {
    const fileUrl = this.httpService.getImageUrl(fileLink);

    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = fileLink.split('/').pop() || 'file.txt';
    a.click();
  }

  private loadComment(id: string): void {
    this.isLoading = true;
    this.commentsService.getCommentWithReplies(id).subscribe({
      next: (data) => {
        this.rootComment = this.buildNestedReplies(data);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  public addReplyToComment(commentId: string): void {
    if (!this.authService.isLoggedIn()) {
      const dialogRef = this.dialog.open(RegistrationComponent, {});
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.router.navigate(['/']);
        }
      });
      return;
    }

    const dialogRef = this.dialog.open(CommentDialogComponent, {
      width: '700px',
      disableClose: true,
      data: { parentCommentId: commentId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.reloadAllComments();
      }
    });
  }

  private reloadAllComments(): void {
    if (this.rootComment) {
      this.loadComment(this.rootComment.id);
    }
  }

  private buildNestedReplies(comment: IComment): IComment {
    if (!comment.replies || comment.replies.length === 0) {
      return comment;
    }
    return {
      ...comment,
      replies: comment.replies.map((reply) => this.buildNestedReplies(reply)),
    };
  }

  public openImage(imageUrl: string): void {
    this.dialog.open(ImageDialogComponent, {
      data: { imageUrl },
      panelClass: 'custom-dialog-container',
    });
  }
}
