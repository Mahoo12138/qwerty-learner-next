import { Exclude, Expose } from 'class-transformer';
import { Uuid } from '@/common/types/common.type';

@Exclude()
export class CategoryResDto {
  @Expose()
  id: Uuid;

  @Expose()
  name: string;

  @Expose()
  isActive: boolean;

  @Expose()
  order: number;

  @Expose()
  description?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}