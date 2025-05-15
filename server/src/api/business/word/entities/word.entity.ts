import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { DictionaryEntity } from '../../dictionary/entities/dictionary.entity';
import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';

@Entity('word')
export class WordEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_word_id',
  })
  id!: Uuid;

  @Column({ length: 100 })
  word: string;

  @Column({ type: 'text', nullable: true })
  definition: string;

  @Column({ type: 'text', array: true, nullable: true })
  translations: string[];

  @Column({ type: 'text', array: true, nullable: true })
  examples: string[];

  @Column({ type: 'text', nullable: true })
  pronunciation: string;

  @Column({ type: 'text', nullable: true, comment: '音标' })
  phoneticNotation: string;

  @Column({ type: 'text', nullable: true })
  audioUrl: string;

  @Column({ length: 50, nullable: true, comment: '词性' })
  partOfSpeech: string; 

  @Column({ type: 'text', array: true, nullable: true })
  synonyms: string[];

  @Column({ type: 'text', array: true, nullable: true })
  antonyms: string[];

  @Column({ nullable: true })
  difficulty: number; // 1-10

  @Column({ default: 0, comment: '词频' })
  frequency: number;

  @Column({ type: 'json', nullable: true, comment: '词元数据' })
  metadata: Record<string, any>; // 额外元数据，如词源、记忆技巧等

  @Column()
  dictionaryId: number;

  @ManyToOne(() => DictionaryEntity, (dictionary) => dictionary.words, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'dictionaryId' })
  dictionary: Relation<DictionaryEntity>;
}
