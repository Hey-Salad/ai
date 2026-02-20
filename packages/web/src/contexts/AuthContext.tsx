import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  getToken,
  setToken,
  removeToken,
  getCurrentUser,
} from '../services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Get user from API
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (token: string) => {
    setToken(token);
    
    // Get user from API
    const currentUser = await getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
