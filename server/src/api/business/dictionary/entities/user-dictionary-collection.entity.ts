import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { DictionaryEntity } from './dictionary.entity';

@Entity('user_dictionary_collection')
@Unique(['userId', 'dictionaryId']) // 确保同一个用户不能重复收藏同一个词典
export class UserDictionaryCollectionEntity extends AbstractEntity {
  constructor(data?: Partial<UserDictionaryCollectionEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_user_dictionary_collection_id',
  })
  id!: Uuid;

  @Column({ type: 'uuid' })
  userId: Uuid;

  @Column({ type: 'uuid' })
  dictionaryId: Uuid;

  // 可选：建立与 UserEntity 和 DictionaryEntity 的关系
  // @ManyToOne(() => UserEntity)
  // @JoinColumn({ name: 'userId' })
  // user: UserEntity;

  @ManyToOne(() => DictionaryEntity, { onDelete: 'CASCADE' }) // 当词典被删除时，收藏记录也删除
  @JoinColumn({ name: 'dictionaryId' })
  dictionary: DictionaryEntity;
}