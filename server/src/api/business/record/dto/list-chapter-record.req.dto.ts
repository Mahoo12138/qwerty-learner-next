import { PageOptionsDto } from '@/common/dto/offset-pagination/page-options.dto';
import { Uuid } from '@/common/types/common.type';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class ListChapterRecordReqDto extends PageOptionsDto {
  @IsOptional()
  @IsUUID()
  dict?: Uuid;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  chapter?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isFinished?: boolean;
}