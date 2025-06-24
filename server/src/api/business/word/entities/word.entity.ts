import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { DictionaryEntity } from '../../dictionary/entities/dictionary.entity';

@Entity('word')
export class WordEntity extends AbstractEntity {
  constructor(data?: Partial<WordEntity>) {
    super();
    Object.assign(this, data);
  }
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_word_id',
  })
  id!: Uuid;

  @Column({ length: 100 })
  word: string;

  @Column({ type: 'text', array: true,  nullable: true, comment: '释义' })
  definition: string[];

  @Column({ type: 'text', array: true, nullable: true, comment: '例句' })
  examples: string[];

  @Column({ type: 'text', nullable: true, comment: '音标' })
  pronunciation: string;


  @Column({ type: 'json', nullable: true, comment: '元数据' })
  metadata: Record<string, any>; // 额外元数据，如词源、记忆技巧等

  @Column({ type: 'uuid' })
  dictionaryId: Uuid;

  @ManyToOne(() => DictionaryEntity, (dictionary) => dictionary.words, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'dictionaryId' })
  dictionary: Relation<DictionaryEntity>;
}
