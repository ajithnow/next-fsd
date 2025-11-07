'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthManager } from '../managers/useAuthManager';
import type { LoginResponse } from '../models/auth.model';
import type { LoginFormValues } from '../schemas/auth.schemas';

type User = LoginResponse['user'] | null;

interface AuthContextValue {
  user: User;
  isAuthenticated: boolean;
  login: (data: LoginFormValues) => Promise<LoginResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { login: managerLogin, logout: managerLogout } = useAuthManager();
  const [user, setUser] = useState<User>(() => {
    if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis) {
      try {
        const raw = globalThis.localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    // keep localStorage and state in sync in case other tabs update it
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'user') {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          setUser(null);
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', onStorage);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', onStorage);
      }
    };
  }, []);

  const login = async (data: LoginFormValues) => {
    const resp = await managerLogin(data);
    setUser(resp.user);
    return resp;
  };

  const logout = async () => {
    await managerLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
