import { Uuid } from '@/common/types/common.type';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateWordDto {
  @IsString()
  @Length(1, 100)
  word: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  definition?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  translations?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  examples?: string[];

  @IsOptional()
  @IsString()
  pronunciation?: string;

  @IsOptional()
  @IsString()
  phoneticNotation?: string;

  @IsOptional()
  @IsString()
  audioUrl?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  partOfSpeech?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  synonyms?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  antonyms?: string[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  difficulty?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  frequency?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsUUID()
  @IsOptional()
  dictionaryId?: Uuid;
}
