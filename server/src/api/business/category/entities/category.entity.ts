import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('category')
export class CategoryEntity extends AbstractEntity {
  constructor(data?: Partial<CategoryEntity>) {
    super();
    Object.assign(this, data);
  }
  
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_category_id',
  })
  id!: Uuid;

  @Column({ length: 50, unique: true })
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  order: number; // 用于排序

  @Column({ nullable: true })
  description: string;
}
