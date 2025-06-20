import { } from '@tanstack/react-router';
import { create } from 'zustand';
import { router } from '@/App';

// 定义 Token 信息的类型，与后端返回一致
interface TokenInfo {
  accessToken: string;
  refreshToken: string;
  tokenExpires: number; // Unix timestamp (milliseconds)
}

// 定义用户信息的类型，根据实际情况调整
interface UserInfo {
  id: string;
  email: string;
  role: string; // 例如 'host', 'admin', 'user'
  // ... 其他用户信息字段
}

// 定义认证状态的类型
interface AuthState {
  token: TokenInfo | null;
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean; // 用于表示 token 刷新或初始加载状态
  error: string | null;

  // Actions
  setToken: (token: TokenInfo | null) => void;
  setUser: (user: UserInfo | null) => void;
  loginSuccess: (token: TokenInfo, user: UserInfo) => void;
  logout: () => void;
  startLoading: () => void;
  stopLoading: (error?: string | null) => void;
}

// 从 localStorage 读取初始 Token 信息
const loadTokenFromStorage = (): TokenInfo | null => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const tokenExpires = localStorage.getItem('tokenExpires');

    if (accessToken && refreshToken && tokenExpires) {
      // 检查 token 是否已过期（简单判断，实际可能需要更精确的逻辑）
      if (Date.now() < parseInt(tokenExpires, 10)) {
         return {
          accessToken,
          refreshToken,
          tokenExpires: parseInt(tokenExpires, 10),
        };
      } else {
        // Token 已过期，清除本地存储
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpires');
        return null;
      }
    }
    return null;
  } catch (e) {
    console.error("Failed to load token from storage:", e);
    return null;
  }
};

// 从 localStorage 读取初始用户信息 (可选，如果用户信息也需要持久化)
const loadUserFromStorage = (): UserInfo | null => {
  try {
    const userJson = localStorage.getItem('userInfo');
    if (userJson) {
      return JSON.parse(userJson) as UserInfo;
    }
    return null;
  } catch (e) {
    console.error("Failed to load user from storage:", e);
    return null;
  }
};


export const useAuthStore = create<AuthState>((set) => {
  const initialToken = loadTokenFromStorage();
  const initialUser = loadUserFromStorage(); // 加载用户信息

  return {
    token: initialToken,
    user: initialUser,
    isAuthenticated: !!initialToken, // 根据 token 是否存在判断是否认证
    isLoading: false,
    error: null,

    setToken: (token) => {
      set({ token, isAuthenticated: !!token });
      if (token) {
        localStorage.setItem('accessToken', token.accessToken);
        localStorage.setItem('refreshToken', token.refreshToken);
        localStorage.setItem('tokenExpires', token.tokenExpires.toString());
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpires');
      }
    },

    setUser: (user) => {
      set({ user });
      if (user) {
        localStorage.setItem('userInfo', JSON.stringify(user));
      } else {
        localStorage.removeItem('userInfo');
      }
    },

    loginSuccess: (token, user) => {
      set({ token, user, isAuthenticated: true, isLoading: false, error: null });
      localStorage.setItem('accessToken', token.accessToken);
      localStorage.setItem('refreshToken', token.refreshToken);
      localStorage.setItem('tokenExpires', token.tokenExpires.toString());
      localStorage.setItem('userInfo', JSON.stringify(user));
    },

    logout: () => {
      set({ token: null, user: null, isAuthenticated: false, isLoading: false, error: null });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpires');
      localStorage.removeItem('userInfo');
      // 清除路由状态并重定向到登录页面
      router.navigate({ to: '/auth/sign-in' });
    },

    startLoading: () => set({ isLoading: true, error: null }),
    stopLoading: (error = null) => set({ isLoading: false, error }),
  };
});