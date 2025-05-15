import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { WordEntity } from '../../word/entities/word.entity';
import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';

@Entity('dictionary')
export class DictionaryEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_dictionary_id',
  })
  id!: Uuid;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50 })
  language: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 0 })
  wordCount: number;

  @Column({ length: 50, default: 'general' })
  category: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  difficulty: number;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @OneToMany(() => WordEntity, (word) => word.dictionary)
  words: Relation<WordEntity>[];
}
