import { fetcher } from './client';

export interface LoginReqDto {
  email: string;
  password?: string;
}

export interface LoginResDto {
  userId: string;
  accessToken: string;
  refreshToken: string;
  tokenExpires: number;
}

export interface RefreshReqDto {
  refreshToken: string;
}

export interface RefreshResDto {
  accessToken: string;
  refreshToken: string;
  tokenExpires: number;
}

export const login = (data: LoginReqDto): Promise<LoginResDto> => {
  return fetcher('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'User-Agent': navigator.userAgent,
    },
  });
};

export const refreshToken = (data: RefreshReqDto): Promise<RefreshResDto> => {
  return fetcher('/api/v1/auth/refresh', { method: 'POST', body: JSON.stringify(data) });
}; 