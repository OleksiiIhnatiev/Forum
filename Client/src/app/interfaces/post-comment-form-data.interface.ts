// note ai In your case, `?` is used to make the `parentCommentId`, `homePage`, and `messageFile` fields optional,
// as not all comments require these data (for example, not all comments have a parent comment or an image).
export interface IPostCommentFormData {
  userId: string;
  text: string;
  parentCommentId?: string;
  homePage?: string;
  messageFile?: File;
}
