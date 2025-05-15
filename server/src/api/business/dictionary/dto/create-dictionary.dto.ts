import { IsString, IsOptional, IsNumber, IsBoolean, IsObject, Length, Min, Max } from 'class-validator';

export class CreateDictionaryDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsString()
  @Length(1, 50)
  language: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  wordCount?: number;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  category?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  difficulty?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
} 