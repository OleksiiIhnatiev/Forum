import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommentsService, Comment } from '../../services/comments.service';
import { MatDialog } from '@angular/material/dialog';
import { CommentDialogComponent } from '../comments-list/comment-dialog/comment-dialog.component';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.component.html',
})
export class CommentsListComponent implements OnInit {
  comments: Comment[] = [];
  currentPage = 1;
  sortBy = 'createdAt';
  order = 'desc';
  isLoading = false;
  errorMessage = '';

  constructor(
    private commentsService: CommentsService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.isLoading = true;

    this.commentsService
      .getMainComments(this.currentPage, this.sortBy, this.order)
      .pipe(
        tap((data) => {
          this.comments = data.filter((comment) => !comment.replies);
          this.sortComments();
          this.isLoading = false;
        }),
        catchError(() => {
          this.errorMessage = 'Error loading comments';
          this.isLoading = false;
          return of([]);
        })
      )
      .subscribe();
  }

  changeSort(field: string): void {
    this.sortBy = field;
    this.order = this.order === 'asc' ? 'desc' : 'asc';
    this.sortComments(); // Сортировка при изменении поля
  }

  sortComments(): void {
    this.comments.sort((a, b) => {
      if (a[this.sortBy] < b[this.sortBy]) {
        return this.order === 'asc' ? -1 : 1;
      } else if (a[this.sortBy] > b[this.sortBy]) {
        return this.order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  onRowClick(comment: Comment): void {
    this.router.navigate(['/comment', comment.id]);
  }

  addMainComment(): void {
    const dialogRef = this.dialog.open(CommentDialogComponent, {
      width: '700px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadComments();
      }
    });
  }
}
