import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

// --- ATUALIZAÇÃO AQUI ---
interface User {
  id: string; 
  nome: string;
  email: string;
  imageUrl?: string | null;
  reviews?: number;
  lists?: number;
  avatar_id?: string; // <-- ADICIONADO PARA O AVATAR
}

// Interface AuthContextData (correta)
interface AuthContextData {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  updateUser: (newUserData: User) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect (correto)
  useEffect(() => {
    async function loadStoredData() {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUser = await AsyncStorage.getItem('userData');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
      } catch (e) {
        console.error('Falha ao carregar dados', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadStoredData();
  }, []);

  // login (correto)
  const login = async (email: string, senha: string) => {
    try {
      const response = await api.post('/auth/login', { email, senha });
      const { token: newToken, usuario: newUsuario } = response.data;
      setToken(newToken);
      setUser(newUsuario);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      await AsyncStorage.setItem('userToken', newToken);
      await AsyncStorage.setItem('userData', JSON.stringify(newUsuario));
    } catch (error) {
      console.error('Falha no login', error);
      throw error;
    }
  };

  // logout (correto)
  const logout = async () => {
    try {
      setToken(null);
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
    } catch (e) {
      console.error('Falha ao deslogar', e);
    }
  };

  // updateUser (correto)
  const updateUser = async (newUserData: User) => {
    setUser(newUserData); 
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(newUserData));
    } catch (e) {
      console.error('Falha ao atualizar o usuário no AsyncStorage', e);
    }
  };

  return (
    <AuthContext.Provider value={{
      token,
      user, 
      isAuthenticated: !!token,
      isLoading,
      login,
      logout,
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth (correto)
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}