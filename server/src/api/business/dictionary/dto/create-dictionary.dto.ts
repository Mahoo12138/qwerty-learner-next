import { IsString, IsOptional, IsNumber, IsBoolean, IsObject, Length, Min, Max, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateWordDto } from '@/api/business/word/dto/create-word.dto';
import { Uuid } from '@/common/types/common.type';


export class CreateDictionaryDto {
  @IsString()
  @Length(1, 100)
  name: string;


  @IsString()
  @Length(1, 100)
  language: string;


  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  wordCount?: number;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  categoryId?: Uuid;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  tags: string[]


  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWordDto)
  words?: CreateWordDto[];
}
