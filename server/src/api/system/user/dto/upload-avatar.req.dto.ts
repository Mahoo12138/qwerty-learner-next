import {
  StringField,
} from '@/decorators/field.decorators';
import { IsString, IsNotEmpty } from 'class-validator';

export class UploadAvatarReqDto {
  @StringField()
  @IsString()
  @IsNotEmpty()
  avatar: string; // base64 编码的图片数据
} 