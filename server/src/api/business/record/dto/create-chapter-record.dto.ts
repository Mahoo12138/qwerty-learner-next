import { Uuid } from '@/common/types/common.type';
import { IsArray, IsBoolean, IsInt, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateChapterRecordDto {
  @IsUUID()
  dict: Uuid;

  @IsNumber()
  @IsOptional()
  chapter?: number | null;

  @IsNumber()
  time: number;

  @IsInt()
  correctCount: number;

  @IsInt()
  wrongCount: number;

  @IsInt()
  wordCount: number;

  @IsArray()
  @IsInt({ each: true })
  correctWordIndexes: number[];

  @IsInt()
  wordNumber: number;

  @IsBoolean()
  @IsOptional()
  isFinished?: boolean;
}