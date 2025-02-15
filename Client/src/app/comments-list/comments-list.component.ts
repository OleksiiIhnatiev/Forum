import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommentsService } from '../../services/comments.service';
import { CommentDto } from '../../app/dtos/comments/comment.dto';
import { MatDialog } from '@angular/material/dialog';
import { CommentDialogComponent } from '../comments-list/comment-dialog/comment-dialog.component';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { RegistrationComponent } from '../layout/registration/registration.component';

@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.component.html',
})
export class CommentsListComponent implements OnInit {
  comments: CommentDto[] = [];
  currentPage = 1;
  sortBy = 'createdAt';
  order = 'desc';
  isLoading = false;
  errorMessage = '';

  constructor(
    private commentsService: CommentsService,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.commentsService.commentsUpdatedSubject.subscribe((updated) => {
      if (updated) {
        this.loadComments();
        this.commentsService.commentsUpdatedSubject.next(false);
      }
    });

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
    this.sortComments();
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

  onRowClick(comment: CommentDto): void {
    this.router.navigate(['/comment', comment.id]);
  }

  // todo ai methods should be named after endpoints on backend. check everywhere
  addMainComment(): void {
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
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.commentsService.addComment(result).subscribe();
      }
    });
  }
}
