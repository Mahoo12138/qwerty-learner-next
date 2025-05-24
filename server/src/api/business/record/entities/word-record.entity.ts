import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';

export interface LetterMistakes {
  [index: number]: string[];
}

@Entity('word_record')
export class WordRecordEntity extends AbstractEntity {
  constructor(data?: Partial<WordRecordEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_word_record_id',
  })
  id!: Uuid;

  @Column({ length: 100, comment: '练习的单词' })
  word: string;

  @Column({ type: 'bigint', comment: '时间戳' })
  timeStamp: number;

  @Column({ length: 100, comment: '词典标识或功能类型' })
  dict: string;

  @Column({ type: 'int', nullable: true, comment: '章节索引，从0开始，错题等场景为null' })
  chapter: number | null;

  @Column({ type: 'int', array: true, comment: '每个字母的输入时间差（毫秒）' })
  timing: number[];

  @Column({ type: 'int', default: 0, comment: '出错次数' })
  wrongCount: number;

  @Column({ type: 'jsonb', comment: '每个字母的错误输入记录' })
  mistakes: LetterMistakes;

  @Column({ type: 'uuid', comment: '用户ID' })
  userId: Uuid;
}