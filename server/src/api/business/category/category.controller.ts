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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ListCategoryReqDto } from './dto/list-category.req.dto';
import { CategoryResDto } from './dto/category.res.dto';
import { CategoryEntity } from './entities/category.entity';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@/common/types/common.type';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { ApiPublic } from '@/decorators/http.decorators';

@ApiTags('Category')
@Controller({ path: 'category', version: '1' })
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully.', type: CategoryEntity })
  @ApiResponse({ status: 409, description: 'Category name already exists.' })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser('id') userId: Uuid,
  ): Promise<CategoryEntity> {
    return await this.categoryService.create(createCategoryDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Return a paginated list of categories',
    type: OffsetPaginatedDto<CategoryResDto>,
  })
  async findAll(@Query() reqDto: ListCategoryReqDto): Promise<OffsetPaginatedDto<CategoryResDto>> {
    return await this.categoryService.findAll(reqDto);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active categories' })
  @ApiResponse({ status: 200, description: 'Return all active categories', type: [CategoryEntity] })
  @ApiPublic()
  async findActive(): Promise<CategoryEntity[]> {
    return await this.categoryService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiResponse({ status: 200, description: 'Return the category', type: CategoryEntity })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async findOne(@Param('id') id: Uuid): Promise<CategoryEntity> {
    return await this.categoryService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully.', type: CategoryEntity })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 409, description: 'Category name already exists.' })
  async update(
    @Param('id') id: Uuid,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @CurrentUser('id') userId: Uuid,
  ): Promise<CategoryEntity> {
    return await this.categoryService.update(id, updateCategoryDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async remove(@Param('id') id: Uuid): Promise<void> {
    return await this.categoryService.remove(id);
  }
}