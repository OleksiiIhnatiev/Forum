import { IComment } from './comment.interface';

export interface ICommentResponse {
  success: boolean;
  message: string;
  data: IComment;
}
