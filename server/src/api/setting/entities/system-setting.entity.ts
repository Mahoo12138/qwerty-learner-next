import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('system-setting')
export class SystemSettingEntity extends AbstractEntity {
  constructor(data?: Partial<SystemSettingEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryColumn({ primaryKeyConstraintName: 'PK_system_setting_name' })
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  content?: string;
}
