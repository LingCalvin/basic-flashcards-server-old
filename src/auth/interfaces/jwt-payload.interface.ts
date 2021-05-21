export interface JwtPayload {
  jti: string;
  sub: string;
  exp: number;
  use: string;
  check: string;
}
