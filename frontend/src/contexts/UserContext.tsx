import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface UserContextType {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// User credentials for MVP
const USERS = [
  {
    email: 'partha.sarthi@elevateidea.com',
    password: 'password',
    name: 'Partha Sarthi',
    role: 'admin' as const
  },
  {
    email: 'demo@suratextiles.com',
    password: 'demo123',
    name: 'Demo User',
    role: 'user' as const
  }
];

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (email: string, password: string): boolean => {
    const foundUser = USERS.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData: User = {
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('userAuth', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userAuth');
  };

  // Check for existing user session on load
  React.useEffect(() => {
    const userAuth = localStorage.getItem('userAuth');
    if (userAuth) {
      try {
        const userData = JSON.parse(userAuth);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('userAuth');
      }
    }
  }, []);

  const value: UserContextType = {
    isAuthenticated,
    user,
    isAdmin: user?.role === 'admin',
    login,
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}