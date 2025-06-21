import { LoginReqDto, LoginResDto, RefreshReqDto, RefreshResDto } from '@/api/model'; // You'll need to create or adjust this path
import { fetcher } from './client';

export const login = (data: LoginReqDto): Promise<LoginResDto> => {
  return fetcher('/api/v1/auth/login', { method: 'POST', body: JSON.stringify(data) });
};

export const refreshToken = (data: RefreshReqDto): Promise<RefreshResDto> => {
  return fetcher('/api/v1/auth/refresh', { method: 'POST', body: JSON.stringify(data) });
}; 