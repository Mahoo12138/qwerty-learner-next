import { ApiProperty } from '@nestjs/swagger';

export class ApiTokenItemDto {
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
    description: '创建时间',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: '过期时间',
    example: '2024-12-31T23:59:59.000Z',
    required: false,
  })
  expiresAt?: string;

  @ApiProperty({
    description: '最后使用时间',
    example: '2024-01-20T15:45:00.000Z',
    required: false,
  })
  lastUsedAt?: string;

  @ApiProperty({
    description: '是否已过期',
    example: false,
  })
  isExpired: boolean;
}

export class ListApiTokensResDto {
  @ApiProperty({
    description: 'API Tokens 列表',
    type: [ApiTokenItemDto],
  })
  items: ApiTokenItemDto[];

  @ApiProperty({
    description: '总数',
    example: 5,
  })
  total: number;
} 