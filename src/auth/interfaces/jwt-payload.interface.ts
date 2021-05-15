export interface JwtPayload {
  jti: string;
  sub: string;
  exp: number;
}
