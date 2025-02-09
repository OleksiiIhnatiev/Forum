import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommentsService, Comment } from '../../../services/comments.service';

@Component({
  selector: 'app-comment-detail',
  templateUrl: './comment-detail.component.html',
  styleUrls: ['./comment-detail.component.css'],
})
export class CommentDetailComponent implements OnInit {
  comment: Comment | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private commentsService: CommentsService
  ) {}

  ngOnInit(): void {
    const commentId = this.route.snapshot.paramMap.get('id');
    if (commentId) {
      this.loadComment(commentId);
    }
  }

  loadComment(id: string): void {
    this.isLoading = true;
    this.commentsService.getCommentById(id).subscribe({
      next: (data) => {
        this.comment = data;
      },
      error: (err) => {
        console.error('Error loading comment:', err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
