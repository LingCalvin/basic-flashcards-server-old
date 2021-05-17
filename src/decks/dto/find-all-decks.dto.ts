import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { SortOrder } from 'src/prisma/types/sort-order';

export class FindAllDecksDto {
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  authorId?: string[];

  @IsOptional()
  @IsString()
  titleEquals?: string;

  @IsOptional()
  @IsString()
  titleContains?: string;

  @IsOptional()
  @IsString()
  descriptionContains?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  orderTitleBy?: SortOrder;

  @IsOptional()
  @IsBoolean()
  caseInsensitive?: boolean;

  @IsOptional()
  @IsNumber()
  skip?: number;

  @IsOptional()
  @IsNumber()
  take?: number;
}
