import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { request } from './client'
import type { MediaFileMeta, SystemSoundCatalog } from '@/types/api'

export interface UploadMediaResult {
  file_id: string
  url: string
}

export function  useSystemSoundCatalog() {
  return useQuery({
    queryKey: ['media', 'sounds', 'system-catalog'],
    queryFn: () => request<SystemSoundCatalog>('/sounds/system'),
    staleTime: 5 * 60 * 1000,
  })
}

export function useUserKeySounds(userId: string | undefined) {
  return useQuery({
    queryKey: ['media', 'user.keysound', userId],
    enabled: Boolean(userId),
    queryFn: () =>
      request<MediaFileMeta[]>(
        `/media?type_key=${encodeURIComponent('user.keysound')}&owner_type=user&owner_id=${encodeURIComponent(userId ?? '')}`,
      ),
    staleTime: 60 * 1000,
  })
}

export function useUploadUserKeySound() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, file, displayName }: { userId: string; file: File; displayName?: string }) => {
      const form = new FormData()
      form.append('type_key', 'user.keysound')
      form.append('owner_type', 'user')
      form.append('owner_id', userId)
      form.append('slot', `custom-${Date.now()}`)
      form.append('display_name', displayName ?? file.name)
      form.append('remark', '用户自定义按键音效')
      form.append('file', file)

      return request<UploadMediaResult>('/media/upload', {
        method: 'POST',
        body: form,
      })
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['media', 'user.keysound', variables.userId] })
      qc.invalidateQueries({ queryKey: ['media', 'sounds', 'system-catalog'] })
    },
  })
}
