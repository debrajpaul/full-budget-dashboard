import { ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react';

export type AuthUser = {
  email: string;
  name: string;
  tenantId: string;
  isActive: boolean;
};

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AUTH_TOKEN_KEY = 'jwt';
const AUTH_USER_KEY = 'auth.user';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readInitialToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

function readInitialUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem(AUTH_USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AuthUser;
  } catch (error) {
    console.warn('Failed to parse stored auth user', error);
    window.localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => readInitialToken());
  const [user, setUser] = useState<AuthUser | null>(() => readInitialUser());

  const login = useCallback((newToken: string, newUser: AuthUser) => {
    setToken(newToken);
    setUser(newUser);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUTH_TOKEN_KEY, newToken);
      window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
      window.localStorage.removeItem(AUTH_USER_KEY);
    }
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
    }),
    [token, user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
