export interface IComment {
  id: string;
  userName: string;
  text: string;
  createdAt: string;
  fileLink?: string;
  homePage?: string | null;
  email?: string | null;
  replies: IComment[];
}
