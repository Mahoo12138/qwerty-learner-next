import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto'; // 导入 OffsetPaginatedDto
import { Uuid } from '@/common/types/common.type';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { ApiPublic } from '@/decorators/http.decorators';
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
import { DictionaryService } from './dictionary.service';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { DictionaryResDto } from './dto/dictionary.res.dto';
import { ListDictionaryReqDto } from './dto/list-dictionary.req.dto';
import { UpdateDictionaryDto } from './dto/update-dictionary.dto';
import { DictionaryEntity } from './entities/dictionary.entity';

@ApiTags('Dictionary')
@Controller({ path: 'dictionary', version: '1' })
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Post()
  async create(
    @Body() createDictionaryDto: CreateDictionaryDto,
    @CurrentUser('id') userId: Uuid,
  ): Promise<DictionaryEntity> {
    return await this.dictionaryService.create(createDictionaryDto, userId);
  }

  @Get()
  async findAll(@Query() reqDto: ListDictionaryReqDto) {
    return await this.dictionaryService.findAll(reqDto);
  }

  // 修改查询所有公开词典的接口，接受分页参数
  @Get('public')
  @ApiOperation({ summary: 'Find all public dictionaries with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Return a paginated list of public dictionaries',
    type: OffsetPaginatedDto<DictionaryEntity>, // 或者 OffsetPaginatedDto<DictionaryResDto>
  })
  @ApiPublic()
  async findPublic(
    @Query() reqDto: ListDictionaryReqDto,
  ): Promise<OffsetPaginatedDto<DictionaryResDto>> {
    return await this.dictionaryService.findPublicDictionaries(reqDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: Uuid): Promise<DictionaryEntity> {
    return await this.dictionaryService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: Uuid,
    @Body() updateDictionaryDto: UpdateDictionaryDto,
  ): Promise<DictionaryEntity> {
    return await this.dictionaryService.update(id, updateDictionaryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: Uuid): Promise<void> {
    return await this.dictionaryService.remove(id);
  }

  @Get('category/:categoryId')
  async findByCategory(
    @Param('categoryId') category: Uuid,
  ): Promise<DictionaryEntity[]> {
    return await this.dictionaryService.findByCategory(category);
  }

  @Put(':id/word-count')
  async updateWordCount(
    @Param('id') id: Uuid,
    @Query('increment') increment: string,
  ): Promise<DictionaryEntity> {
    return await this.dictionaryService.updateWordCount(
      id,
      increment ? +increment : 1,
    );
  }
}
