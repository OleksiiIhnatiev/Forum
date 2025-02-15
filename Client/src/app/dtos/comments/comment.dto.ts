export interface CommentDto {
  id: string;
  userName: string;
  text: string;
  createdAt: string;
  imgLink?: string;
  homePage?: string | null;
  email?: string | null;
  replies: CommentDto[];
}
