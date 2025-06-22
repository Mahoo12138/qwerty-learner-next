import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApiTokenReqDto {
  @ApiProperty({
    description: 'Token 名称/备注',
    example: 'GitHub Integration',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: '过期时间 (ISO 8601 格式)',
    example: '2024-12-31T23:59:59.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
} 