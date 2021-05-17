import { IsJWT } from 'class-validator';

export class VerifyAccessTokenDto {
  @IsJWT()
  token: string;
}
