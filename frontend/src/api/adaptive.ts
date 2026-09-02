import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { request } from './client'
import type { AdaptiveProfile, AdaptiveSessionResult } from '@/types/api'

export function useAdaptiveProfile(enabled = true) {
  return useQuery({
    queryKey: ['adaptive', 'profile'],
    queryFn: () => request<AdaptiveProfile>('/adaptive/profile'),
    enabled,
    staleTime: 60_000,
  })
}

export function useCreateAdaptiveSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { item_count?: number } = {}) =>
      request<AdaptiveSessionResult>('/adaptive/sessions', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sessions'] })
      qc.invalidateQueries({ queryKey: ['adaptive', 'profile'] })
    },
  })
}
