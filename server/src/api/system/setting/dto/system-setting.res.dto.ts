import {
  StringField,
  StringFieldOptional,
} from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SystemSettingResDto {

  @StringField()
  @Expose()
  name: string;

  @StringFieldOptional()
  @Expose()
  description?: string;

  @StringFieldOptional()
  @Expose()
  content?: string;
}
