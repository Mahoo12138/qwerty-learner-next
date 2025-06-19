import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto'; // 导入 OffsetPaginatedDto
import { Uuid } from '@/common/types/common.type';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { ApiPublic } from '@/decorators/http.decorators'; // 导入 ApiPublic 装饰器
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateWordDto } from './dto/create-word.dto';
import { ListWordReqDto } from './dto/list-word.req.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { WordResDto } from './dto/word.res.dto';
import { WordEntity } from './entities/word.entity';
import { WordService } from './word.service';

@ApiTags('Word')
@Controller({
  version: '1',
  path: 'word',
})
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new word' })
  async create(
    @Body() createWordDto: CreateWordDto,
    @CurrentUser('id') userId: Uuid,
  ): Promise<WordEntity> {
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
  async findAll(@Query() reqDto: ListWordReqDto) {
    return await this.wordService.findAll(reqDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search words' })
  async searchWords(@Query('query') query: string): Promise<WordEntity[]> {
    return await this.wordService.searchWords(query);
  }

  @Get('dictionary/:dictionaryId')
  @ApiOperation({ summary: 'Find words by dictionary with pagination' })
  async findByDictionary(
    @Param('dictionaryId') dictionaryId: Uuid,
    @Query() reqDto: ListWordReqDto,
  ): Promise<OffsetPaginatedDto<WordResDto>> {
    return await this.wordService.findByDictionary(dictionaryId, reqDto);
  }

  @Get('difficulty/:difficulty')
  @ApiOperation({ summary: 'Find words by difficulty' })
  async findByDifficulty(
    @Param('difficulty') difficulty: string,
  ): Promise<WordEntity[]> {
    return await this.wordService.findByDifficulty(+difficulty);
  }

  @Get('public/dictionary/:dictionaryId') // 新增的公开接口路径
  @ApiPublic() // 标记为公开接口
  @ApiOperation({ summary: 'Find words by public dictionary with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Return a paginated list of words from a public dictionary',
    type: OffsetPaginatedDto<WordEntity>, // 或者 OffsetPaginatedDto<WordResDto>
  })
  async findWordsByPublicDictionary(
    @Param('dictionaryId') dictionaryId: Uuid,
    @Query() reqDto: ListWordReqDto, // 接受分页参数
  ): Promise<OffsetPaginatedDto<WordResDto>> {
    return await this.wordService.findWordsByPublicDictionary(
      dictionaryId,
      reqDto,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a word by id' })
  async findOne(@Param('id') id: Uuid): Promise<WordEntity> {
    return await this.wordService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a word' })
  async update(
    @Param('id') id: Uuid,
    @Body() updateWordDto: UpdateWordDto,
  ): Promise<WordEntity> {
    return await this.wordService.update(id, updateWordDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a word' })
  async remove(@Param('id') id: Uuid): Promise<void> {
    return await this.wordService.remove(id);
  }
}
