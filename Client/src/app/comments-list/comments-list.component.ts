import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommentsService, Comment } from '../../services/comments.service';

@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.css'],
})
export class CommentsListComponent implements OnInit {
  comments: Comment[] = [];
  currentPage = 1;
  sortBy = 'createdAt';
  order = 'desc';
  isLoading = true;

  constructor(
    private commentsService: CommentsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.isLoading = true;

    this.commentsService
      .getMainComments(this.currentPage, this.sortBy, this.order)
      .subscribe({
        next: (data) => {
          console.log('Data received:', data);
          this.comments = data.filter((comment) => !comment.isReply); 
        },
        error: (err) => {
          console.error('Error loading comments:', err);
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  changeSort(field: string): void {
    if (this.sortBy === field) {
      this.order = this.order === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.order = 'asc';
    }
    this.loadComments();
  }

  onRowClick(comment: Comment): void {
    this.router.navigate(['/comment', comment.id]); 
  }
}
