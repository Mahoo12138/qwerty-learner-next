import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class WordResDto {
  @Expose()
  id: number;

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
  dictionaryId: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
} 