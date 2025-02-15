export interface TokenDto {
  userId: string;
  name: string;
  sub: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': string;
}
