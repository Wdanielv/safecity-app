'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authApi, type LoginPayload, type RegisterPayload } from '@/lib/api/auth.api';
import { usersApi } from '@/lib/api/users.api';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from '@/lib/auth/token-storage';
import type { User } from '@/types/api';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('idle');

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const hasSession = Boolean(getAccessToken() ?? getRefreshToken());
      if (!hasSession) {
        if (!cancelled) setStatus('unauthenticated');
        return;
      }

      setStatus('loading');
      try {
        const profile = await usersApi.getMe();
        if (!cancelled) {
          setUser(profile);
          setStatus('authenticated');
        }
      } catch {
        clearTokens();
        if (!cancelled) {
          setUser(null);
          setStatus('unauthenticated');
        }
      }
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    setStatus('loading');
    try {
      const { accessToken, refreshToken } = await authApi.login(payload);
      setTokens(accessToken, refreshToken);
      const profile = await usersApi.getMe();
      setUser(profile);
      setStatus('authenticated');
    } catch (error) {
      setStatus('unauthenticated');
      throw error;
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setStatus('loading');
    try {
      const { accessToken, refreshToken } = await authApi.register(payload);
      setTokens(accessToken, refreshToken);
      const profile = await usersApi.getMe();
      setUser(profile);
      setStatus('authenticated');
    } catch (error) {
      setStatus('unauthenticated');
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // El token puede ya estar vencido/inválido; igual limpiamos la sesión local.
    } finally {
      clearTokens();
      setUser(null);
      setStatus('unauthenticated');
    }
  }, []);

  const updateUser = useCallback((next: User) => {
    setUser(next);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isAuthenticated: status === 'authenticated',
      login,
      register,
      logout,
      updateUser,
    }),
    [user, status, login, register, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
