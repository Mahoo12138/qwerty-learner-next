import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { WordService } from './word.service';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { WordEntity } from './entities/word.entity';
import { ListWordReqDto } from './dto/list-word.req.dto';
import { WordResDto } from './dto/word.res.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OffsetPaginationDto } from '../../../common/dto/offset-pagination/offset-pagination.dto';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { Uuid } from '@/common/types/common.type';

@ApiTags('Word')
@Controller({
  version: '1',
  path: 'word',
})
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new word' })
  async create(@Body() createWordDto: CreateWordDto, @CurrentUser('id') userId: Uuid): Promise<WordEntity> {
    return await this.wordService.create(createWordDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'List words with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Return paginated words',
    type: WordResDto,
    isArray: true,
  })
  async findAll(
    @Query() reqDto: ListWordReqDto,
  ) {
    return await this.wordService.findAll(reqDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search words' })
  async searchWords(@Query('query') query: string): Promise<WordEntity[]> {
    return await this.wordService.searchWords(query);
  }

  @Get('dictionary/:dictionaryId')
  @ApiOperation({ summary: 'Find words by dictionary' })
  async findByDictionary(@Param('dictionaryId') dictionaryId: string): Promise<WordEntity[]> {
    return await this.wordService.findByDictionary(+dictionaryId);
  }

  @Get('difficulty/:difficulty')
  @ApiOperation({ summary: 'Find words by difficulty' })
  async findByDifficulty(@Param('difficulty') difficulty: string): Promise<WordEntity[]> {
    return await this.wordService.findByDifficulty(+difficulty);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a word by id' })
  async findOne(@Param('id') id: string): Promise<WordEntity> {
    return await this.wordService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a word' })
  async update(
    @Param('id') id: string,
    @Body() updateWordDto: UpdateWordDto,
  ): Promise<WordEntity> {
    return await this.wordService.update(+id, updateWordDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a word' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.wordService.remove(+id);
  }
}
