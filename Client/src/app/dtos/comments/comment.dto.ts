export interface CommentDto {
  id: string;
  userName: string;
  text: string;
  createdAt: string;
  // todo determine correct name. fix everywhere
  imgLink?: string;
  homePage?: string | null;
  email?: string | null;
  replies: CommentDto[];
}
