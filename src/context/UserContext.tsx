'use client';

import { createContext, useContext, useState } from 'react';


type User = {
  id?: string;
  name: string;
  email: string;
  phone: string;
};

type UserContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
    login: (userData: User) => void;
    logout: () => void;
  };

  const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
    login: () => {},
    logout: () => {},
  });
  
  export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
  
    const login = (userData: User) => {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    };
  
    const logout = () => {
      setUser(null);
      localStorage.removeItem('user');
    };
  
    return (
      <UserContext.Provider value={{ user, setUser, login, logout }}>
        {children}
      </UserContext.Provider>
    );
  }
  
  export const useUser = () => useContext(UserContext);