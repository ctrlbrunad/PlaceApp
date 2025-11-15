import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

// Interface User (como no seu arquivo)
interface User {
  id: string; 
  nome: string;
  email: string;
  imageUrl?: string | null;
  reviews?: number;
  lists?: number;
}

// --- 1. ATUALIZAR A INTERFACE 'AuthContextData' ---
interface AuthContextData {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  updateUser: (newUserData: User) => void; // <-- ADICIONADO AQUI
}

// Atualiza o 'createContext' para corresponder à nova interface
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect (como no seu arquivo, está correto)
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

  // login (como no seu arquivo, está correto)
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

  // logout (como no seu arquivo, está correto)
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

  // --- 2. ADICIONAR A NOVA FUNÇÃO 'updateUser' ---
  // (Esta é a função que a tela 'Configurações' vai chamar)
  const updateUser = async (newUserData: User) => {
    setUser(newUserData); // Atualiza o estado global
    try {
      // Atualiza também o cache local
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
      updateUser // <-- 3. EXPORTAR A NOVA FUNÇÃO
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado (como no seu arquivo)
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}