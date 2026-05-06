import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { request } from './client'
import type { WordMasteryItem, WordMasteryListResponse, WordMasteryStatus } from '@/types/api'

export type WordMasteryFilter = 'all' | WordMasteryStatus

export function useWordMasteries({
  status = 'mastered',
  search = '',
  page = 1,
  pageSize = 20,
}: {
  status?: WordMasteryFilter
  search?: string
  page?: number
  pageSize?: number
}) {
  return useQuery({
    queryKey: ['word-masteries', status, search, page, pageSize],
    queryFn: () => {
      const params = new URLSearchParams({
        status,
        page: String(page),
        page_size: String(pageSize),
      })
      const trimmedSearch = search.trim()
      if (trimmedSearch) {
        params.set('search', trimmedSearch)
      }
      return request<WordMasteryListResponse>(`/practice/word-masteries?${params.toString()}`)
    },
  })
}

export function usePromoteWordMastery() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => request<{ item: WordMasteryItem }>(`/practice/word-masteries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ state: 'mastered' }),
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['word-masteries'] })
    },
  })
}

export function useMarkWordMastered() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (wordId: string) => request<{ item: WordMasteryItem }>('/practice/word-masteries/mark-mastered', {
      method: 'POST',
      body: JSON.stringify({ word_id: wordId }),
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['word-masteries'] })
    },
  })
}