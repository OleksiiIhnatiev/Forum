import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommentsListComponent } from './comments-list/comments-list.component';
import { CommentDetailComponent } from './comments-list/comment-detail/comment-detail.component';

const routes: Routes = [
  { path: '', component: CommentsListComponent },
  { path: 'comment/:id', component: CommentDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
