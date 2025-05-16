import { EntityRepository, Repository } from 'typeorm';
import { DictionaryEntity } from './entities/dictionary.entity';

@EntityRepository(DictionaryEntity)
export class DictionaryRepository extends Repository<DictionaryEntity> {}
