import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PageOptionsDto } from '../../../../common/dto/offset-pagination/page-options.dto';

export class ListWordReqDto extends PageOptionsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  dictionaryId?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  difficulty?: number;
} 