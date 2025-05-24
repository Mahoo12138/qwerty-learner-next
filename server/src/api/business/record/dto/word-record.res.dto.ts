import { Exclude, Expose } from 'class-transformer';
import { Uuid } from '@/common/types/common.type';
import { LetterMistakes } from '../entities/word-record.entity';

@Exclude()
export class WordRecordResDto {
  @Expose()
  id: Uuid;

  @Expose()
  chapterRecordId: Uuid | null;

  @Expose()
  dictId: Uuid;

  @Expose()
  wordId: Uuid;

  @Expose()
  wordName: string;

  @Expose()
  chapter: number | null;

  @Expose()
  timing: number[];

  @Expose()
  wrongCount: number;

  @Expose()
  mistakes: LetterMistakes;

  @Expose()
  createdAt: Date;
}