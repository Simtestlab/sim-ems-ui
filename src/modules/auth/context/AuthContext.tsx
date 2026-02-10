'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number | string;
  email?: string;
  username: string;
  name: string;
  role: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  role_display?: string;
  organization?: {
    id: string;
    name: string;
  } | null;
  is_active?: boolean;
  date_joined?: string;
  last_login?: string | null;
}

interface LoginResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetch current user on mount
  useEffect(() => {
    refreshUser();
  }, []);

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setUser(null);
        return;
      }

      const baseURL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${baseURL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user || userData);
      } else {
        setUser(null);
        localStorage.removeItem('access_token');
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
      localStorage.removeItem('access_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const baseURL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${baseURL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.detail || 'Authentication failed';
        return { success: false, error: errorMessage };
      }

      const data = await response.json();
      
      console.log('Login successful, received data:', data);

      // Validate response
      if (!data.access || !data.user) {
        return { success: false, error: 'Invalid response from server' };
      }

      // Store token and user
      localStorage.setItem('access_token', data.access);
      
      const user: User = {
        id: data.user.id,
        name: data.user.full_name,
        role: data.user.role,
        username: data.user.username,
        email: data.user.email,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        full_name: data.user.full_name,
        role_display: data.user.role_display,
        organization: data.user.organization,
        is_active: data.user.is_active,
        date_joined: data.user.date_joined,
        last_login: data.user.last_login,
      };
      
      setUser(user);
      return { success: true };

    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Remove token from localStorage
      localStorage.removeItem('access_token');
      
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsLoading(false);
      router.push('/login');
      router.refresh();
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useUser() {
  const { user } = useAuth();
  return user;
}
