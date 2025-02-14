import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommentDto } from '../../../app/dtos/comments/comment.dto';
import { CommentsService } from '../../../services/comments.service';
import { CommentDialogComponent } from '../comment-dialog/comment-dialog.component';
import { ImageDialogComponent } from '../comment-detail/image-dialog/image-dialog.component';
import { AuthService } from '../../../services/auth.service';
import { RegistrationComponent } from '../../layout/registration/registration.component';

@Component({
  selector: 'app-comment-detail',
  templateUrl: './comment-detail.component.html',
})
export class CommentDetailComponent implements OnInit {
  @Input() comment: CommentDto | null = null;
  isLoading = true;
  rootComment: CommentDto | null = null;

  constructor(
    private route: ActivatedRoute,
    private commentsService: CommentsService,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
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

  loadComment(id: string): void {
    this.isLoading = true;
    this.commentsService.getCommentById(id).subscribe({
      next: (data) => {
        console.log('Полученный комментарий:', data);
        this.rootComment = this.buildNestedReplies(data);
      },
      error: (err) => {
        console.error('Ошибка загрузки комментария:', err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  addReplyToComment(commentId: string): void {
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

  reloadAllComments(): void {
    if (this.rootComment) {
      this.loadComment(this.rootComment.id);
    }
  }

  buildNestedReplies(comment: CommentDto): CommentDto {
    if (!comment.replies || comment.replies.length === 0) {
      return comment;
    }
    return {
      ...comment,
      replies: comment.replies.map((reply) => this.buildNestedReplies(reply)),
    };
  }

  openImage(imageUrl: string): void {
    this.dialog.open(ImageDialogComponent, {
      data: { imageUrl },
      panelClass: 'custom-dialog-container',
    });
  }
}
