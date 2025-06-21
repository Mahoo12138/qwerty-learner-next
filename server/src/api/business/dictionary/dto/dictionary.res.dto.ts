import { Exclude, Expose, Type } from 'class-transformer';
import { Uuid } from '@/common/types/common.type';

@Exclude()
export class WordResDto {
  @Expose()
  id: Uuid;

  @Expose()
  word: string;

  @Expose()
  definition: string;

  @Expose()
  translations: string[];

  @Expose()
  examples: string[];

  @Expose()
  pronunciation: string;

  @Expose()
  phoneticNotation: string;

  @Expose()
  audioUrl: string;

  @Expose()
  partOfSpeech: string;

  @Expose()
  synonyms: string[];

  @Expose()
  antonyms: string[];

  @Expose()
  difficulty: number;

  @Expose()
  frequency: number;

  @Expose()
  metadata: Record<string, any>;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

@Exclude()
export class DictionaryResDto {
  @Expose()
  id: Uuid;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  wordCount: number;

  @Expose()
  categoryId: Uuid;

  @Expose()
  isActive: boolean;

  @Expose()
  isPublic: boolean;

  @Expose()
  tags: string[];

  @Expose()
  metadata: Record<string, any>;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
