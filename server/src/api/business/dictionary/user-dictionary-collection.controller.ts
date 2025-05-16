import { Controller, Post, Delete, Param, Get, Query, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Uuid } from '@/common/types/common.type';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { UserDictionaryCollectionService } from './user-dictionary-collection.service';
import { CollectDictionaryDto } from './dto/collect-dictionary.dto';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { DictionaryResDto } from './dto/dictionary.res.dto';
import { ListDictionaryReqDto } from './dto/list-dictionary.req.dto';

@ApiTags('User Dictionary Collection')
@Controller({ path: 'user/collections/dictionary', version: '1' })
export class UserDictionaryCollectionController {
  constructor(private readonly collectionService: UserDictionaryCollectionService) {}

  @Post()
  @ApiOperation({ summary: 'Collect a public dictionary' })
  @ApiResponse({ status: 201, description: 'Dictionary collected successfully.' })
  @ApiResponse({ status: 404, description: 'Dictionary not found or not public.' })
  @ApiResponse({ status: 409, description: 'Dictionary already collected.' })
  async collectDictionary(
    @CurrentUser('id') userId: Uuid,
    @Body() collectDto: CollectDictionaryDto,
  ): Promise<void> {
    await this.collectionService.collectDictionary(userId, collectDto.dictionaryId);
  }

  @Delete(':dictionaryId')
  @HttpCode(HttpStatus.NO_CONTENT) // 成功删除返回 204 No Content
  @ApiOperation({ summary: 'Uncollect a dictionary' })
  @ApiResponse({ status: 204, description: 'Dictionary uncollected successfully.' })
  @ApiResponse({ status: 404, description: 'Collection not found.' })
  async uncollectDictionary(
    @CurrentUser('id') userId: Uuid,
    @Param('dictionaryId') dictionaryId: Uuid,
  ): Promise<void> {
    await this.collectionService.uncollectDictionary(userId, dictionaryId);
  }

  @Get()
  @ApiOperation({ summary: 'Get collected dictionaries for the current user' })
  @ApiResponse({ status: 200, description: 'Return a paginated list of collected dictionaries.', type: OffsetPaginatedDto<DictionaryResDto> })
  async getCollectedDictionaries(
    @CurrentUser('id') userId: Uuid,
    @Query() reqDto: ListDictionaryReqDto, // 接受分页和过滤参数
  ): Promise<OffsetPaginatedDto<DictionaryResDto>> {
    return await this.collectionService.findCollectedDictionaries(userId, reqDto);
  }

  @Get(':dictionaryId/is-collected')
  @ApiOperation({ summary: 'Check if the current user has collected a specific dictionary' })
  @ApiResponse({ status: 200, description: 'Return true if collected, false otherwise.' })
  async isCollected(
    @CurrentUser('id') userId: Uuid,
    @Param('dictionaryId') dictionaryId: Uuid,
  ): Promise<{ isCollected: boolean }> {
    const isCollected = await this.collectionService.isCollected(userId, dictionaryId);
    return { isCollected };
  }
}