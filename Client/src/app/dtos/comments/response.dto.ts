import { CommentDto } from './comment.dto';

export interface CommentResponseDto {
  success: boolean;
  message: string;
  data: CommentDto;
}
