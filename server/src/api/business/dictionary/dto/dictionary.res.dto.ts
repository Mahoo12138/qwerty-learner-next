import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DictionaryResDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  language: string;

  @Expose()
  description?: string;

  @Expose()
  wordCount?: number;

  @Expose()
  category?: string;

  @Expose()
  isActive?: boolean;

  @Expose()
  difficulty?: number;

  @Expose()
  metadata?: Record<string, any>;
} 