import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, Relation } from 'typeorm';
import { DictionaryEntity } from '@/api/business/dictionary/entities/dictionary.entity';

@Entity('tag')
export class TagEntity extends AbstractEntity {
  constructor(data?: Partial<TagEntity>) {
    super();
    Object.assign(this, data);
  }
  @PrimaryGeneratedColumn('uuid')
  id: Uuid;

  @Column({ length: 50, unique: true })
  name: string;

  @ManyToMany(() => DictionaryEntity, (dictionary) => dictionary.tags)
  dictionaries: Relation<DictionaryEntity>[];
}
