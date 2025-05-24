import { Uuid } from '@/common/types/common.type';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNumber, IsObject, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { LetterMistakes } from '../entities/word-record.entity';

export class CreateWordRecordDto {
  @IsUUID()
  @IsOptional()
  chapterRecordId?: Uuid | null;

  @IsUUID()
  dictId: Uuid;

  @IsUUID()
  wordId: Uuid;

  @IsString()
  @Length(1, 100)
  wordName: string;

  @IsNumber()
  @IsOptional()
  chapter?: number | null;

  @IsArray()
  @IsNumber({}, { each: true })
  timing: number[];

  @IsInt()
  wrongCount: number;

  @IsObject()
  mistakes: LetterMistakes;
}