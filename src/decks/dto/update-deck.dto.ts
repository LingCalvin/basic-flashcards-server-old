import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UpdateCardDto } from './update-card.dto';

export class UpdateDeckDto {
  @IsNotEmpty()
  title: string;

  @IsIn(['PRIVATE', 'PUBLIC'])
  visibility: 'PRIVATE' | 'PUBLIC';

  @IsString()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateCardDto)
  cards: UpdateCardDto[];
}
