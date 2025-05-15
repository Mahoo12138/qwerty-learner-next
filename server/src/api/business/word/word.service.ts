import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WordEntity } from './entities/word.entity';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { DictionaryService } from '../dictionary/dictionary.service';
import { ListWordReqDto } from './dto/list-word.req.dto';
import { WordResDto } from './dto/word.res.dto';
import { plainToInstance } from 'class-transformer';
import { paginate } from '@/utils/offset-pagination';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@/common/types/common.type';

@Injectable()
export class WordService {
  constructor(
    @InjectRepository(WordEntity)
    private wordRepository: Repository<WordEntity>,
    private dictionaryService: DictionaryService,
  ) { }

  async create(createWordDto: CreateWordDto, userId: Uuid): Promise<WordEntity> {
    // 验证字典是否存在
    await this.dictionaryService.findOne(createWordDto.dictionaryId);
    const word = new WordEntity({
      ...createWordDto,
      createdBy: userId,
      updatedBy: userId,
    });
    const savedWord = await this.wordRepository.save(word);

    // 更新字典的单词数量
    await this.dictionaryService.updateWordCount(createWordDto.dictionaryId, 1);

    return savedWord;
  }

  async findAll(reqDto: ListWordReqDto) {
    const query = this.wordRepository
      .createQueryBuilder('word')
      .orderBy('word.createdAt', 'DESC');
    const [words, metaDto] = await paginate<WordEntity>(query, reqDto, {
      skipCount: false,
      takeAll: false,
    });
    return new OffsetPaginatedDto(plainToInstance(WordResDto, words), metaDto);
  }

  async findOne(id: number): Promise<WordEntity> {
    const word = await this.wordRepository.findOne({
      where: { id },
      relations: ['dictionary'],
    });

    if (!word) {
      throw new NotFoundException(`Word with ID ${id} not found`);
    }

    return word;
  }

  async update(id: number, updateWordDto: UpdateWordDto): Promise<WordEntity> {
    const word = await this.findOne(id);

    if (updateWordDto.dictionaryId && updateWordDto.dictionaryId !== word.dictionaryId) {
      // 如果更改了字典，需要更新两个字典的单词数量
      await this.dictionaryService.updateWordCount(word.dictionaryId, -1);
      await this.dictionaryService.updateWordCount(updateWordDto.dictionaryId, 1);
    }

    Object.assign(word, updateWordDto);
    return await this.wordRepository.save(word);
  }

  async remove(id: number): Promise<void> {
    const word = await this.findOne(id);
    await this.wordRepository.remove(word);

    // 更新字典的单词数量
    await this.dictionaryService.updateWordCount(word.dictionaryId, -1);
  }

  async findByDictionary(dictionaryId: number): Promise<WordEntity[]> {
    return await this.wordRepository.find({
      where: { dictionaryId },
      relations: ['dictionary'],
    });
  }

  async searchWords(query: string): Promise<WordEntity[]> {
    return await this.wordRepository
      .createQueryBuilder('word')
      .where('word.word ILIKE :query', { query: `%${query}%` })
      .orWhere('word.definition ILIKE :query', { query: `%${query}%` })
      .leftJoinAndSelect('word.dictionary', 'dictionary')
      .getMany();
  }

  async findByDifficulty(difficulty: number): Promise<WordEntity[]> {
    return await this.wordRepository.find({
      where: { difficulty },
      relations: ['dictionary'],
    });
  }
}
