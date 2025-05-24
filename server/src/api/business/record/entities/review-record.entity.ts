import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';

export interface Word {
  name: string;
  trans: string[];
  usphone: string;
  ukphone: string;
  notation?: string;
}

@Entity('review_record')
export class ReviewRecordEntity extends AbstractEntity {
  constructor(data?: Partial<ReviewRecordEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_review_record_id',
  })
  id!: Uuid;

  @Column({ length: 100, comment: '词典标识' })
  dict: string;

  @Column({ type: 'int', default: 0, comment: '当前练习进度' })
  index: number;

  @Column({ type: 'bigint', comment: '创建时间' })
  createTime: number;

  @Column({ type: 'boolean', default: false, comment: '是否已完成' })
  isFinished: boolean;

  @Column({ type: 'jsonb', comment: '单词列表，根据复习算法生成' })
  words: Word[];

  @Column({ type: 'uuid', comment: '用户ID' })
  userId: Uuid;
}