import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn, Relation,
} from 'typeorm';
import { UserEntity } from './user.entity';

// 定义令牌类型枚举
export enum TokenType {
  SESSION = 'session',    // 用户登录会话
  API = 'api',           // API 令牌
}

@Entity('token')
export class TokenEntity extends AbstractEntity {
  constructor(data?: Partial<TokenEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_token_id',
  })
  id!: Uuid;

  @Column({
    name: 'type',
    type: 'enum',
    enum: TokenType,
    comment: '令牌类型',
  })
  type!: TokenType;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '令牌名称/备注（仅 API 令牌）',
  })
  name?: string;

  @Column({
    name: 'hash',
    type: 'varchar',
    length: 255,
    comment: '令牌 hash',
  })
  hash!: string;

  @Column({
    name: 'user_id',
    type: 'uuid',
    comment: '用户ID',
  })
  userId: Uuid;

  @Column({
    name: 'expires_at',
    type: 'timestamptz',
    nullable: true,
    comment: '过期时间',
  })
  expiresAt?: Date;

  @Column({
    name: 'last_used_at',
    type: 'timestamptz',
    nullable: true,
    comment: '最后使用时间',
  })
  lastUsedAt?: Date;

  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_token_user',
  })
  @ManyToOne(() => UserEntity, (user) => user.tokens)
  user!: Relation<UserEntity>;

  /**
   * 检查令牌是否已过期
   */
  isExpired(): boolean {
    if (!this.expiresAt) {
      return false;
    }
    return new Date() > this.expiresAt;
  }

  /**
   * 更新最后使用时间
   */
  updateLastUsed(): void {
    this.lastUsedAt = new Date();
  }
}
