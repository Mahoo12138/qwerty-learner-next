import {
  StringField,
} from '@/decorators/field.decorators';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordReqDto {
  @StringField()
  @IsString()
  currentPassword: string;

  @StringField()
  @IsString()
  @MinLength(6)
  newPassword: string;
} 