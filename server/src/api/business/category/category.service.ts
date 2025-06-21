import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ListCategoryReqDto } from './dto/list-category.req.dto';
import { CategoryResDto } from './dto/category.res.dto';
import { paginate } from '@/utils/offset-pagination';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { plainToInstance } from 'class-transformer';
import { Uuid } from '@/common/types/common.type';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, userId: Uuid): Promise<CategoryEntity> {
    // 检查名称是否已存在
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });
    if (existingCategory) {
      throw new ConflictException(`Category with name '${createCategoryDto.name}' already exists`);
    }

    const newCategory = new CategoryEntity({
      ...createCategoryDto,
      createdBy: userId,
      updatedBy: userId,
    });
    
    return await this.categoryRepository.save(newCategory);
  }

  async findAll(reqDto: ListCategoryReqDto): Promise<OffsetPaginatedDto<CategoryResDto>> {
    const query = this.categoryRepository
      .createQueryBuilder('category')
      .orderBy('category.order', 'ASC')
      .addOrderBy('category.createdAt', 'DESC');

    // 搜索过滤
    if (reqDto.search) {
      query.andWhere(
        '(category.name ILIKE :search OR category.description ILIKE :search)',
        { search: `%${reqDto.search}%` },
      );
    }

    // 状态过滤
    if (reqDto.isActive !== undefined) {
      query.andWhere('category.isActive = :isActive', { isActive: reqDto.isActive });
    }

    const [categories, metaDto] = await paginate<CategoryEntity>(query, reqDto, {
      skipCount: false,
      takeAll: false,
    });

    return new OffsetPaginatedDto(plainToInstance(CategoryResDto, categories), metaDto);
  }

  async findOne(id: Uuid): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: Uuid, updateCategoryDto: UpdateCategoryDto, userId: Uuid): Promise<CategoryEntity> {
    const category = await this.findOne(id);

    // 如果更新名称，检查是否与其他分类重复
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name },
      });
      if (existingCategory) {
        throw new ConflictException(`Category with name '${updateCategoryDto.name}' already exists`);
      }
    }

    Object.assign(category, updateCategoryDto, { updatedBy: userId });
    return await this.categoryRepository.save(category);
  }

  async remove(id: Uuid): Promise<void> {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }

  async findByName(name: string): Promise<CategoryEntity | null> {
    return await this.categoryRepository.findOne({ where: { name } });
  }

  async findActive(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find({
      where: { isActive: true },
      order: { order: 'ASC', createdAt: 'DESC' },
    });
  }
}