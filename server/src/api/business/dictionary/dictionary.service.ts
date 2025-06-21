import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@/common/types/common.type';
import { paginate } from '@/utils/offset-pagination';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { DataSource, Repository } from 'typeorm';
import { WordEntity } from '../word/entities/word.entity';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { DictionaryResDto } from './dto/dictionary.res.dto';
import { ListDictionaryReqDto } from './dto/list-dictionary.req.dto';
import { UpdateDictionaryDto } from './dto/update-dictionary.dto';
import { DictionaryEntity } from './entities/dictionary.entity';
import { CategoryEntity } from '../category/entities/category.entity';

@Injectable()
export class DictionaryService {
  constructor(
    @InjectRepository(DictionaryEntity)
    private dictionaryRepository: Repository<DictionaryEntity>,
    @InjectRepository(WordEntity)
    private wordRepository: Repository<WordEntity>,
    private dataSource: DataSource,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) { }

  async create(
    createDictionaryDto: CreateDictionaryDto,
    userId: Uuid,
  ): Promise<DictionaryEntity> {
    const { name, isPublic, words, categoryId, ...otherFields } =
      createDictionaryDto;

    // 使用事务来确保数据一致性
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 创建词典
      const newDict = new DictionaryEntity({
        name,
        isPublic,
        categoryId,
        wordCount: words?.length || 0,
        ...otherFields,
        createdBy: userId,
        updatedBy: userId,
      });

      const dictionary = await queryRunner.manager.save(
        DictionaryEntity,
        newDict,
      );

      // 如果有单词，则创建单词
      if (words && words.length > 0) {
        const wordEntities = words.map((wordDto) => {
          const wordEntity = new WordEntity({
            ...wordDto,
            dictionaryId: dictionary.id,
            createdBy: userId,
            updatedBy: userId,
          });
          return wordEntity;
        });

        await queryRunner.manager.save(WordEntity, wordEntities);
      }

      await queryRunner.commitTransaction();

      // 返回包含单词的完整词典
      return await this.findOne(dictionary.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(reqDto: ListDictionaryReqDto) {
    const query = this.dictionaryRepository
      .createQueryBuilder('dictionary')
      // .leftJoinAndSelect('dictionary.words', 'words')
      .leftJoinAndSelect('dictionary.category', 'category')
      .orderBy('dictionary.createdAt', 'DESC');
    const [dicts, metaDto] = await paginate<DictionaryEntity>(query, reqDto, {
      skipCount: false,
      takeAll: false,
    });
    return new OffsetPaginatedDto(
      plainToInstance(DictionaryResDto, dicts),
      metaDto,
    );
  }

  async findOne(id: Uuid): Promise<DictionaryEntity> {
    const dictionary = await this.dictionaryRepository.findOne({
      where: { id },
      relations: ['words', 'category'],
    });
    if (!dictionary) {
      throw new NotFoundException(`Dictionary with ID ${id} not found`);
    }
    return dictionary;
  }

  async update(
    id: Uuid,
    updateDictionaryDto: UpdateDictionaryDto,
  ): Promise<DictionaryEntity> {
    const dictionary = await this.findOne(id);

    // 处理 categoryId
    if (updateDictionaryDto.categoryId) {
      const category = await this.categoryRepository.findOneBy({ id: updateDictionaryDto.categoryId });
      if (!category) throw new NotFoundException('分类不存在');
      dictionary.category = category;
      dictionary.categoryId = updateDictionaryDto.categoryId;
    } else {
      // 允许词典“无分类”
      dictionary.category = null;
      dictionary.categoryId = null;
    }

    // 其它字段直接赋值
    Object.assign(dictionary, updateDictionaryDto);

    return await this.dictionaryRepository.save(dictionary);
  }

  async remove(id: Uuid): Promise<void> {
    const result = await this.dictionaryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Dictionary with ID ${id} not found`);
    }
  }

  async findByCategory(categoryId: Uuid): Promise<DictionaryEntity[]> {
    return await this.dictionaryRepository.find({ where: { categoryId } });
  }

  async updateWordCount(
    id: Uuid,
    increment: number = 1,
  ): Promise<DictionaryEntity> {
    const dictionary = await this.findOne(id);
    dictionary.wordCount += increment;
    if (dictionary.wordCount < 0) {
      dictionary.wordCount = 0;
    }
    return await this.dictionaryRepository.save(dictionary);
  }

  async findPublicDictionaries(
    reqDto: ListDictionaryReqDto,
  ): Promise<OffsetPaginatedDto<DictionaryResDto>> {
    const query = this.dictionaryRepository
      .createQueryBuilder('dictionary')
      .where('dictionary.isPublic = :isPublic', { isPublic: true }) // 过滤公开词典
      .orderBy('dictionary.createdAt', 'DESC');

    const [dictionaries, metaDto] = await paginate<DictionaryEntity>(
      query,
      reqDto,
      {
        skipCount: false,
        takeAll: false,
      },
    );

    return new OffsetPaginatedDto(
      plainToInstance(DictionaryResDto, dictionaries),
      metaDto,
    );
  }
}
