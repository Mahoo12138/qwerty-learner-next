import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';

@Entity('revision_word_record')
export class RevisionWordRecordEntity extends AbstractEntity {
  constructor(data?: Partial<RevisionWordRecordEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_revision_word_record_id',
  })
  id!: Uuid;

  @Column({ length: 100, comment: '单词' })
  word: string;

  @Column({ type: 'bigint', comment: '时间戳' })
  timeStamp: number;

  @Column({ length: 100, comment: '词典标识' })
  dict: string;

  @Column({ type: 'int', default: 0, comment: '错误次数' })
  errorCount: number;

  @Column({ type: 'uuid', comment: '用户ID' })
  userId: Uuid;
}