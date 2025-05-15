import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, DeleteDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('user-setting')
export class UserSettingEntity extends AbstractEntity {
  constructor(data?: Partial<UserSettingEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryColumn({ primaryKeyConstraintName: 'PK_user_setting_name' })
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  content?: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: Uuid;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    default: null,
  })
  deletedAt: Date;
}
