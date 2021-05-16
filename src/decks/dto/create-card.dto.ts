import { IsString } from 'class-validator';

export class CreateCardDto {
  @IsString()
  frontText: string;

  @IsString()
  backText: string;
}
