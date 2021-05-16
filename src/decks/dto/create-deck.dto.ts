import { IsUUID } from 'class-validator';
import { UpdateDeckDto } from './update-deck.dto';

export class CreateDeckDto extends UpdateDeckDto {
  @IsUUID('4')
  authorId: string;
}
