import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { CategoryEntity } from '../../category/entities/category.entity';
import { WordEntity } from '../../word/entities/word.entity';

@Entity('dictionary')
export class DictionaryEntity extends AbstractEntity {
  constructor(data?: Partial<DictionaryEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_dictionary_id',
  })
  id!: Uuid;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, comment: '词库语言' })
  language: string;


  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 0 })
  wordCount: number;

  @ManyToOne(() => CategoryEntity)
  @JoinColumn({ name: 'categoryId' })
  category: Relation<CategoryEntity>;

  @Column({ nullable: true })
  categoryId: Uuid;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false, comment: '是否公开' })
  isPublic: boolean;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @OneToMany(() => WordEntity, (word) => word.dictionary)
  words: Relation<WordEntity>[];
}
