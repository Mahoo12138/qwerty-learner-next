import { IsString, IsOptional, IsBoolean, IsNumber, Length, Min } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Length(1, 50)
  name: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number;

  @IsOptional()
  @IsString()
  description?: string;
}