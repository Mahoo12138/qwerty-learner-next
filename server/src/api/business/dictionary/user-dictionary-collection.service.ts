import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDictionaryCollectionEntity } from './entities/user-dictionary-collection.entity';
import { Uuid } from '@/common/types/common.type';
import { DictionaryService } from './dictionary.service';
import { DictionaryEntity } from './entities/dictionary.entity';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { ListDictionaryReqDto } from './dto/list-dictionary.req.dto';
import { paginate } from '@/utils/offset-pagination';
import { plainToInstance } from 'class-transformer';
import { DictionaryResDto } from './dto/dictionary.res.dto';

@Injectable()
export class UserDictionaryCollectionService {
  constructor(
    @InjectRepository(UserDictionaryCollectionEntity)
    private collectionRepository: Repository<UserDictionaryCollectionEntity>,
    private dictionaryService: DictionaryService, // 注入 DictionaryService 用于验证词典是否存在和是否公开
  ) {}

  /**
   * 收藏词典
   * @param userId 用户ID
   * @param dictionaryId 词典ID
   * @returns 收藏实体
   */
  async collectDictionary(userId: Uuid, dictionaryId: Uuid): Promise<UserDictionaryCollectionEntity> {
    // 1. 验证词典是否存在且为公开
    const dictionary = await this.dictionaryService.findOne(dictionaryId);
    if (!dictionary.isPublic) {
      throw new NotFoundException(`Dictionary with ID ${dictionaryId} is not public and cannot be collected.`);
    }

    // 2. 检查是否已收藏
    const existingCollection = await this.collectionRepository.findOne({
      where: { userId, dictionaryId },
    });
    if (existingCollection) {
      throw new ConflictException(`Dictionary with ID ${dictionaryId} is already collected by user ${userId}.`);
    }

    // 3. 创建收藏记录
    const collection = new UserDictionaryCollectionEntity({
      userId,
      dictionaryId,
      createdBy: userId, // 收藏操作由用户自己执行
      updatedBy: userId,
    });

    return await this.collectionRepository.save(collection);
  }

  /**
   * 取消收藏词典
   * @param userId 用户ID
   * @param dictionaryId 词典ID
   */
  async uncollectDictionary(userId: Uuid, dictionaryId: Uuid): Promise<void> {
    // 1. 查找收藏记录
    const collection = await this.collectionRepository.findOne({
      where: { userId, dictionaryId },
    });

    if (!collection) {
      throw new NotFoundException(`Collection of dictionary ${dictionaryId} by user ${userId} not found.`);
    }

    // 2. 删除收藏记录
    await this.collectionRepository.remove(collection);
  }

  /**
   * 获取用户收藏的词典列表 (带分页)
   * @param userId 用户ID
   * @param reqDto 分页请求参数
   * @returns 收藏的词典列表 (分页结果)
   */
  async findCollectedDictionaries(userId: Uuid, reqDto: ListDictionaryReqDto): Promise<OffsetPaginatedDto<DictionaryResDto>> {
    const query = this.collectionRepository
      .createQueryBuilder('collection')
      .where('collection.userId = :userId', { userId })
      .leftJoinAndSelect('collection.dictionary', 'dictionary') // 关联查询词典信息
      .orderBy('collection.createdAt', 'DESC'); // 按收藏时间排序

    // 应用分页
    const [collections, metaDto] = await paginate<UserDictionaryCollectionEntity>(query, reqDto, {
      skipCount: false,
      takeAll: false,
    });

    // 提取词典实体并转换为 DTO
    const dictionaries = collections.map(collection => collection.dictionary);
    return new OffsetPaginatedDto(plainToInstance(DictionaryResDto, dictionaries), metaDto);
  }

   /**
   * 检查用户是否收藏了某个词典
   * @param userId 用户ID
   * @param dictionaryId 词典ID
   * @returns boolean 是否已收藏
   */
  async isCollected(userId: Uuid, dictionaryId: Uuid): Promise<boolean> {
    const count = await this.collectionRepository.count({
      where: { userId, dictionaryId },
    });
    return count > 0;
  }
}