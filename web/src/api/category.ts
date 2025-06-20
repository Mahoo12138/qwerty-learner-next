import { fetcher } from './client';

export interface CategoryResDto {
  id: string;
  name: string;
  isActive: boolean;
  order: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  isActive?: boolean;
  isPublic?: boolean;
  order?: number;
  description?: string;
  categoryId?: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

// 查询全部激活分类
export const fetchCategories = () =>
  fetcher('/api/v1/category/active');

// 创建分类
export const createCategory = (data: CreateCategoryDto) =>
  fetcher('/api/v1/category', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

// 更新分类
export const updateCategory = (id: string, data: UpdateCategoryDto) =>
  fetcher(`/api/v1/category/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

// 删除分类
export const deleteCategory = (id: string) =>
  fetcher(`/api/v1/category/${id}`, {
    method: 'DELETE',
  }); 