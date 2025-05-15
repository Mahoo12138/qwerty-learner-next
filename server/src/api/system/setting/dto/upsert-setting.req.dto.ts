import {
  StringField,
  StringFieldOptional,
} from '@/decorators/field.decorators';

export class UpsertSettingReqDto {
  @StringField()
  readonly name: string;

  @StringFieldOptional()
  readonly description?: string;

  @StringFieldOptional()
  readonly content?: string;
}
