import { ApiProperty } from '@nestjs/swagger';

export class CreateApiTokenResDto {
  @ApiProperty({
    description: 'API Token ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Token 名称/备注',
    example: 'GitHub Integration',
  })
  name: string;

  @ApiProperty({
    description: '访问令牌',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: '刷新令牌',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: '令牌过期时间戳',
    example: 1735689599000,
  })
  tokenExpires: number;

  @ApiProperty({
    description: '过期时间',
    example: '2024-12-31T23:59:59.000Z',
    required: false,
  })
  expiresAt?: string;
} 