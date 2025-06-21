import { PageOptionsDto } from '@/common/dto/offset-pagination/page-options.dto';
import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class ListCategoryReqDto extends PageOptionsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;
}