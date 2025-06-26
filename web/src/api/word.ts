import { fetcher } from './client';

export interface WordResDto {
  id: string;
  word: string;
  definition?: string;
  translations?: string[];
  examples?: string[];
  pronunciation?: string;
  phoneticNotation?: string;
  audioUrl?: string;
  partOfSpeech?: string;
  synonyms?: string[];
  antonyms?: string[];
  difficulty?: number;
  frequency?: number;
  metadata?: Record<string, any>;
  dictionaryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWordDto extends Omit<WordResDto, 'id' | 'createdAt' | 'updatedAt'> {}
export interface UpdateWordDto extends Partial<CreateWordDto> {}

export interface OffsetPagination {
  limit: number;
  currentPage: number;
  nextPage?: number;
  previousPage?: number;
  totalRecords: number;
  totalPages: number;
}

export interface OffsetPaginatedDto<T> {
  data: T[];
  pagination: OffsetPagination;
}

export const createWord = (data: CreateWordDto) =>
  fetcher('/api/v1/word', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const updateWord = (id: string, data: UpdateWordDto) =>
  fetcher(`/api/v1/word/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const deleteWord = (id: string) =>
  fetcher(`/api/v1/word/${id}`, {
    method: 'DELETE',
  });

export const fetchWordsByDictionary = (dictionaryId: string, params: { page?: number; limit?: number }) =>
  fetcher(`/api/v1/word/dictionary/${dictionaryId}?${new URLSearchParams(params as any)}`);

export const importWords = (dictionaryId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return fetcher(`/api/v1/word/import/${dictionaryId}`, {
    method: 'POST',
    body: formData,
    // The browser will automatically set the Content-Type to multipart/form-data
    // when using FormData, so we don't set it manually in the fetcher.
  });
}; 