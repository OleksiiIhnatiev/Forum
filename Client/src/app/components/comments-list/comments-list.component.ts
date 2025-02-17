import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommentsService } from '../../../services/comments.service';
import { IComment } from '../../interfaces/comment.interface';
import { MatDialog } from '@angular/material/dialog';
import { CommentDialogComponent } from '../comments-list/comment-dialog/comment-dialog.component';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { RegistrationComponent } from '../registration/registration.component';
import { ErrorHandlingService } from '../../../services/error-handling.service';

@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.scss'],
})
export class CommentsListComponent implements OnInit {
  public comments: IComment[] = [];
  public sortBy: keyof IComment = 'createdAt';
  public order: 'asc' | 'desc' = 'desc';
  public isLoading = false;
  public errorMessage = '';

  constructor(
    private commentsService: CommentsService,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private errorHandlingService: ErrorHandlingService
  ) {}

  public ngOnInit(): void {
    this.commentsService.commentsUpdatedSubject.subscribe((updated) => {
      if (updated) {
        this.loadComments();
        this.commentsService.commentsUpdatedSubject.next(false);
      }
    });

    this.loadComments();
  }

  public loadComments(): void {
    this.isLoading = true;

    this.commentsService
      .getMainComments()
      .pipe(
        tap((data) => {
          this.comments = data.filter((comment) => !comment.replies);
          this.sortComments();
          this.isLoading = false;
        }),
        this.errorHandlingService.handleError()
      )
      .subscribe({
        error: () => {
          this.errorMessage = 'Error loading comments';
          this.isLoading = false;
        },
      });
  }

  public changeSort(field: keyof IComment): void {
    if (this.sortBy === field) {
      this.order = this.order === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.order = 'asc';
    }
    this.sortComments();
  }

  public sortComments(): void {
    this.comments.sort((a, b) => {
      if (a[this.sortBy] < b[this.sortBy]) return this.order === 'asc' ? -1 : 1;
      if (a[this.sortBy] > b[this.sortBy]) return this.order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  public get sortIconClass(): string {
    return this.order === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
  }

  public onRowClick(comment: IComment): void {
    this.router.navigate(['/comment', comment.id]);
  }

  public addMainComment(): void {
    if (!this.authService.isLoggedIn()) {
      const dialogRef = this.dialog.open(RegistrationComponent);
      dialogRef.afterClosed().subscribe((result) => {
        if (result) this.router.navigate(['/']);
      });
      return;
    }

    const dialogRef = this.dialog.open(CommentDialogComponent, {
      width: '700px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.commentsService.postComment(result).subscribe();
      }
    });
  }
}
