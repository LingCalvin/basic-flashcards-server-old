import { IsUUID } from 'class-validator';

export class FindOneDeckDto {
  @IsUUID('4')
  id: string;
}
