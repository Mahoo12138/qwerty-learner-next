import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DictionaryEntity } from './entities/dictionary.entity';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { UpdateDictionaryDto } from './dto/update-dictionary.dto';
import { paginate } from '@/utils/offset-pagination';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { plainToInstance } from 'class-transformer';
import { DictionaryResDto } from './dto/dictionary.res.dto';
import { ListDictionaryReqDto } from './dto/list-dictionary.req.dto';
import { Uuid } from '@/common/types/common.type';

@Injectable()
export class DictionaryService {
  constructor(
    @InjectRepository(DictionaryEntity)
    private dictionaryRepository: Repository<DictionaryEntity>,
  ) { }

  async create(createDictionaryDto: CreateDictionaryDto, userId: Uuid): Promise<DictionaryEntity> {
    const { name, language } = createDictionaryDto
    const newDict = new DictionaryEntity({
      name, 
      language,
      createdBy: userId,
      updatedBy: userId,
    });
    const dictionary = this.dictionaryRepository.create(newDict);
    return await this.dictionaryRepository.save(dictionary);
  }

  async findAll(reqDto: ListDictionaryReqDto) {
    const query = this.dictionaryRepository
      .createQueryBuilder('dictionary')
      .orderBy('dictionary.createdAt', 'DESC');
    const [words, metaDto] = await paginate<DictionaryEntity>(query, reqDto, {
      skipCount: false,
      takeAll: false,
    });
    return new OffsetPaginatedDto(plainToInstance(DictionaryResDto, words), metaDto);
  }

  async findOne(id: Uuid): Promise<DictionaryEntity> {
    const dictionary = await this.dictionaryRepository.findOne({ where: { id } });
    if (!dictionary) {
      throw new NotFoundException(`Dictionary with ID ${id} not found`);
    }
    return dictionary;
  }

  async update(id: Uuid, updateDictionaryDto: UpdateDictionaryDto): Promise<DictionaryEntity> {
    const dictionary = await this.findOne(id);
    Object.assign(dictionary, updateDictionaryDto);
    return await this.dictionaryRepository.save(dictionary);
  }

  async remove(id: Uuid): Promise<void> {
    const result = await this.dictionaryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Dictionary with ID ${id} not found`);
    }
  }

  async findByLanguage(language: string): Promise<DictionaryEntity[]> {
    return await this.dictionaryRepository.find({ where: { language } });
  }

  async findByCategory(category: string): Promise<DictionaryEntity[]> {
    return await this.dictionaryRepository.find({ where: { category } });
  }

  async updateWordCount(id: Uuid, increment: number = 1): Promise<DictionaryEntity> {
    const dictionary = await this.findOne(id);
    dictionary.wordCount += increment;
    return await this.dictionaryRepository.save(dictionary);
  }
}
