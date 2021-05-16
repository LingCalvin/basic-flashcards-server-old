import { IsOptional, IsUUID } from 'class-validator';
import { CreateCardDto } from './create-card.dto';

export class UpdateCardDto extends CreateCardDto {
  @IsUUID('4')
  @IsOptional()
  id?: string;
}
