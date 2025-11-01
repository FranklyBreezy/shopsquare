import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, User, LoginResponse } from '../services/apiClient';

type Ctx = {
  user: User | null;
  setUser: (u: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const UserContext = createContext<Ctx>({ 
  user: null, 
  setUser: () => {},
  login: async () => false,
  logout: () => {}
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('ss_user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('ss_user');
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('ss_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ss_user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response: LoginResponse = await api.users.login({ email, password });
      setUser(response.user);
      localStorage.setItem('auth_token', response.token);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('ss_user');
  };

  const value = useMemo(() => ({ user, setUser, login, logout }), [user]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);


