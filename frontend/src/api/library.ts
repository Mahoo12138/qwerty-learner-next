import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { request } from './client'
import type {
  ContentLibraryType,
  LibraryDiscoveryPayload,
  LibrarySubscriptionItem,
} from '@/types/api'

interface LibrarySubscriptionListResponse {
  list?: LibrarySubscriptionItem[]
}

function normalizeLibrarySubscriptions(
  payload: LibrarySubscriptionItem[] | LibrarySubscriptionListResponse | null | undefined,
) {
  if (Array.isArray(payload)) {
    return payload
  }
  if (Array.isArray(payload?.list)) {
    return payload.list
  }
  return []
}

export function useLibrarySubscriptions(libraryType?: ContentLibraryType) {
  return useQuery({
    queryKey: ['librarySubscriptions', libraryType ?? 'all'],
    queryFn: () => {
      const params = new URLSearchParams()
      if (libraryType) {
        params.set('library_type', libraryType)
      }
      const suffix = params.size > 0 ? `?${params.toString()}` : ''
      return request<LibrarySubscriptionItem[] | LibrarySubscriptionListResponse>(
        `/library-subscriptions${suffix}`,
      ).then(normalizeLibrarySubscriptions)
    },
  })
}

export function useLibraryDiscovery() {
  return useQuery({
    queryKey: ['libraryDiscovery'],
    queryFn: () => request<LibraryDiscoveryPayload>('/library-discovery'),
  })
}

export function useCreateLibrarySubscription() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { library_type: ContentLibraryType; library_id: string }) =>
      request<LibrarySubscriptionItem>('/library-subscriptions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['librarySubscriptions'] })
		qc.invalidateQueries({ queryKey: ['libraryDiscovery'] })
    },
  })
}

export function useDeleteLibrarySubscription() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ libraryType, libraryId }: { libraryType: ContentLibraryType; libraryId: string }) =>
      request<null>(`/library-subscriptions/${libraryType}/${libraryId}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['librarySubscriptions'] })
		qc.invalidateQueries({ queryKey: ['libraryDiscovery'] })
    },
  })
}