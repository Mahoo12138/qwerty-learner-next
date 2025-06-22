import { fetcher } from './client';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
}

export interface ApiToken {
  id: string;
  name: string;
  token: string;
  type: 'session' | 'api';
  createdAt: string;
  expiresAt?: string;
  lastUsedAt?: string;
  isExpired: boolean;
}

export interface CreateTokenRequest {
  name: string;
  expiresAt?: string;
}

export interface CreateTokenResponse {
  id: string;
  name: string;
  accessToken: string;
  refreshToken: string;
  tokenExpires: number;
  expiresAt?: string;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  bio?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UploadAvatarRequest {
  avatar: string; // base64 编码的图片数据
}

// 获取用户信息
export const getUserProfile = async (): Promise<UserProfile> => {
  return await fetcher('/api/v1/users/profile');
};

// 更新用户信息
export const updateUserProfile = async (data: UpdateProfileRequest): Promise<UserProfile> => {
  return await fetcher('/api/v1/users/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

// 上传头像
export const uploadAvatar = async (data: UploadAvatarRequest): Promise<UserProfile> => {
  return await fetcher('/api/v1/users/avatar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

// 修改密码
export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
  await fetcher('/api/v1/users/change-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

// 获取 API Tokens
export const getApiTokens = async (): Promise<{ items: ApiToken[]; total: number }> => {
  return await fetcher('/api/v1/auth/api-tokens');
};

// 创建 API Token
export const createApiToken = async (data: CreateTokenRequest): Promise<CreateTokenResponse> => {
  return await fetcher('/api/v1/auth/api-tokens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

// 删除 API Token
export const deleteApiToken = async (tokenId: string): Promise<void> => {
  await fetcher(`/api/v1/auth/api-tokens/${tokenId}`, {
    method: 'DELETE',
  });
}; 