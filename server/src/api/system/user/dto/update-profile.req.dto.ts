import {
  StringField,
  StringFieldOptional,
} from '@/decorators/field.decorators';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileReqDto {
  @StringFieldOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  username?: string;

  @StringFieldOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  email?: string;

  @StringFieldOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @StringFieldOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  image?: string;
} 