import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { UpdateDictionaryDto } from './dto/update-dictionary.dto';
import { DictionaryEntity } from './entities/dictionary.entity';
import { ListDictionaryReqDto } from './dto/list-dictionary.req.dto';

@Controller({ path: 'dictionary', version: '1' })
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) { }

  @Post()
  async create(@Body() createDictionaryDto: CreateDictionaryDto): Promise<DictionaryEntity> {
    return await this.dictionaryService.create(createDictionaryDto);
  }

  @Get()
  async findAll(@Query() reqDto: ListDictionaryReqDto) {
    return await this.dictionaryService.findAll(reqDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<DictionaryEntity> {
    return await this.dictionaryService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDictionaryDto: UpdateDictionaryDto,
  ): Promise<DictionaryEntity> {
    return await this.dictionaryService.update(+id, updateDictionaryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.dictionaryService.remove(+id);
  }

  @Get('language/:language')
  async findByLanguage(@Param('language') language: string): Promise<DictionaryEntity[]> {
    return await this.dictionaryService.findByLanguage(language);
  }

  @Get('category/:category')
  async findByCategory(@Param('category') category: string): Promise<DictionaryEntity[]> {
    return await this.dictionaryService.findByCategory(category);
  }

  @Put(':id/word-count')
  async updateWordCount(
    @Param('id') id: string,
    @Query('increment') increment: string,
  ): Promise<DictionaryEntity> {
    return await this.dictionaryService.updateWordCount(+id, increment ? +increment : 1);
  }
}
