import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';

@Entity('revision_dict_record')
export class RevisionDictRecordEntity extends AbstractEntity {
  constructor(data?: Partial<RevisionDictRecordEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_revision_dict_record_id',
  })
  id!: Uuid;

  @Column({ length: 100, comment: '词典标识' })
  dict: string;

  @Column({ type: 'int', comment: '复习进度索引' })
  revisionIndex: number;

  @Column({ type: 'bigint', comment: '创建时间' })
  createdTime: number;

  @Column({ type: 'uuid', comment: '用户ID' })
  userId: Uuid;
}