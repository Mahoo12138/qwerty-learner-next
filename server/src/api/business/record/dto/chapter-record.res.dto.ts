import { Exclude, Expose } from 'class-transformer';
import { Uuid } from '@/common/types/common.type';

@Exclude()
export class ChapterRecordResDto {
  @Expose()
  id: Uuid;

  @Expose()
  dict: Uuid;

  @Expose()
  chapter: number | null;

  @Expose()
  time: number;

  @Expose()
  correctCount: number;

  @Expose()
  wrongCount: number;

  @Expose()
  wordCount: number;

  @Expose()
  correctWordIndexes: number[];

  @Expose()
  wordNumber: number;

  @Expose()
  isFinished: boolean;

  @Expose()
  createdAt: Date;
}