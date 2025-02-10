import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommentsService, Comment } from '../../../services/comments.service';
import { CommentDialogComponent } from '../comment-dialog/comment-dialog.component';

@Component({
  selector: 'app-comment-detail',
  templateUrl: './comment-detail.component.html',
  styleUrls: ['./comment-detail.component.css'],
})
export class CommentDetailComponent implements OnInit {
  @Input() comment: Comment | null = null;
  isLoading = true;
  rootComment: Comment | null = null;

  constructor(
    private route: ActivatedRoute,
    private commentsService: CommentsService,
    private dialog: MatDialog
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

  buildNestedReplies(comment: Comment): Comment {
    if (!comment.replies || comment.replies.length === 0) {
      return comment;
    }
    return {
      ...comment,
      replies: comment.replies.map((reply) => this.buildNestedReplies(reply)),
    };
  }
}
