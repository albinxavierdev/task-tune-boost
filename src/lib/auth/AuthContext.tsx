
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // In a real app, this would check Supabase session
  useEffect(() => {
    const checkUser = () => {
      const savedUser = localStorage.getItem('devfocus_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    };

    checkUser();
  }, []);

  // Mock login function - would use Supabase in production
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      email,
      created_at: new Date().toISOString(),
    };
    
    localStorage.setItem('devfocus_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsLoading(false);
  };

  // Mock GitHub login - would use Supabase in production
  const loginWithGithub = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      email: 'github-user@example.com',
      created_at: new Date().toISOString(),
      avatar_url: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    };
    
    localStorage.setItem('devfocus_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsLoading(false);
  };

  // Mock sign up function - would use Supabase in production
  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      email,
      created_at: new Date().toISOString(),
    };
    
    localStorage.setItem('devfocus_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsLoading(false);
  };

  // Mock logout function - would use Supabase in production
  const logout = async () => {
    localStorage.removeItem('devfocus_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        loginWithGithub,
        logout,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
