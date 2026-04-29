import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { request } from './client'
import type { User } from '@/types/api'

export interface AdminUserListRes {
  list: User[]
  total: number
  page: number
  page_size: number
}

export function useAdminUsers(page = 1, pageSize = 50) {
  return useQuery({
    queryKey: ['admin', 'users', page, pageSize],
    queryFn: () =>
      request<AdminUserListRes>(`/admin/users?page=${page}&page_size=${pageSize}`),
    staleTime: 30 * 1000,
  })
}

export function useCreateAdminUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: { username: string; email: string; password: string; role: 'user' | 'admin' }) =>
      request<User>('/admin/users', {
        method: 'POST',
        body: JSON.stringify(params),
      }),
    onSettled: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })
}

export function useUpdateAdminUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...params }: { id: string; is_active?: number; role?: string }) =>
      request<User>(`/admin/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(params),
      }),
    onSettled: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })
}

export function useDeleteAdminUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      request<null>(`/admin/users/${id}`, {
        method: 'DELETE',
      }),
    onSettled: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })
}
