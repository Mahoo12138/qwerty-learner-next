import { IsUUID } from 'class-validator';
import { Uuid } from '@/common/types/common.type';

export class CollectDictionaryDto {
  @IsUUID()
  dictionaryId: Uuid;
}