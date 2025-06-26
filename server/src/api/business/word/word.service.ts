import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

interface ImportedWord {
  name: string;
  trans: string[];
  usphone?: string;
  ukphone?: string;
  examples?: string[];
}

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
      updatedBy: userId
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

  async findOne(id: Uuid): Promise<WordEntity> {
    const word = await this.wordRepository.findOne({
      where: { id },
      relations: ['dictionary'],
    });

    if (!word) {
      throw new NotFoundException(`Word with ID ${id} not found`);
    }

    return word;
  }

  async update(id: Uuid, updateWordDto: UpdateWordDto): Promise<WordEntity> {
    const word = await this.findOne(id);

    if (updateWordDto.dictionaryId && updateWordDto.dictionaryId !== word.dictionaryId) {
      // 如果更改了字典，需要更新两个字典的单词数量
      await this.dictionaryService.updateWordCount(word.dictionaryId, -1);
      await this.dictionaryService.updateWordCount(updateWordDto.dictionaryId, 1);
    }

    Object.assign(word, updateWordDto);
    return await this.wordRepository.save(word);
  }

  async remove(id: Uuid): Promise<void> {
    const word = await this.findOne(id);
    await this.wordRepository.remove(word);
    // 更新字典的单词数量
    await this.dictionaryService.updateWordCount(word.dictionaryId, -1);
  }

  async findByDictionary(dictionaryId: Uuid, reqDto: ListWordReqDto): Promise<OffsetPaginatedDto<WordResDto>> {
    const query = this.wordRepository
      .createQueryBuilder('word')
      .where('word.dictionaryId = :dictionaryId', { dictionaryId })
      .orderBy('word.createdAt', 'DESC');
    const [words, metaDto] = await paginate<WordEntity>(query, reqDto, {
      skipCount: false,
      takeAll: false,
    });
    return new OffsetPaginatedDto(plainToInstance(WordResDto, words), metaDto);
  }

  async searchWords(query: string): Promise<WordEntity[]> {
    return await this.wordRepository
      .createQueryBuilder('word')
      .where('word.word ILIKE :query', { query: `%${query}%` })
      .orWhere('word.definition ILIKE :query', { query: `%${query}%` })
      .leftJoinAndSelect('word.dictionary', 'dictionary')
      .getMany();
  }

  /**
   * 查询公开词典的单词 (带分页)
   * @param dictionaryId 词典ID
   * @param reqDto 分页请求参数
   * @returns 单词列表 (分页结果)
   */
  async findWordsByPublicDictionary(dictionaryId: Uuid, reqDto: ListWordReqDto): Promise<OffsetPaginatedDto<WordResDto>> {
    // 验证词典是否存在且为公开
    const dictionary = await this.dictionaryService.findOne(dictionaryId);
    if (!dictionary.isPublic) {
      throw new NotFoundException(`Dictionary with ID ${dictionaryId} is not public`);
    }

    // 查询该公开词典下的所有单词 (带分页)
    const query = this.wordRepository
      .createQueryBuilder('word')
      .where('word.dictionaryId = :dictionaryId', { dictionaryId })
      .orderBy('word.createdAt', 'DESC');

    const [words, metaDto] = await paginate<WordEntity>(query, reqDto, {
      skipCount: false,
      takeAll: false,
    });

    return new OffsetPaginatedDto(plainToInstance(WordResDto, words), metaDto);
  }

  async importWords(
    dictionaryId: Uuid,
    file: Express.Multer.File,
    userId: Uuid,
  ) {
    if (!file) {
      throw new BadRequestException('File is required.');
    }

    // 1. Validate dictionary
    await this.dictionaryService.findOne(dictionaryId);

    // 2. Parse JSON file
    let wordsToImport: ImportedWord[];
    try {
      const fileContent = file.buffer.toString('utf-8');
      wordsToImport = JSON.parse(fileContent);
      if (!Array.isArray(wordsToImport)) {
        throw new Error(); // Will be caught and re-thrown by the catch block
      }
    } catch (error) {
      throw new BadRequestException(
        'Invalid JSON file. It must be an array of word objects.',
      );
    }

    // 3. Map to WordEntity
    const newWords = wordsToImport
      .map((item) => {
        if (!item.name || !item.trans) {
          return null;
        }
        const pronunciation = [item.usphone, item.ukphone]
          .filter(Boolean)
          .join(', ');

        return new WordEntity({
          word: item.name,
          definition: item.trans,
          pronunciation,
          examples: item.examples,
          dictionaryId,
          createdBy: userId,
          updatedBy: userId,
        });
      })
      .filter((word) => word !== null) as WordEntity[];

    if (newWords.length === 0) {
      return { success: true, message: 'No valid words to import.' };
    }

    // 4. Bulk insert
    await this.wordRepository.insert(newWords);

    // 5. Update word count
    await this.dictionaryService.updateWordCount(dictionaryId, newWords.length);

    return {
      success: true,
      message: `Successfully imported ${newWords.length} words.`,
    };
  }
}
