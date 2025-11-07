import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

// 1. Definir o tipo do objeto Usuário (com base no seu authController.js)
interface User {
  id: string; 
  nome: string;
  email: string;
  imageUrl?: string | null; // <-- ADICIONE ISSO
  reviews?: number;         // <-- ADICIONE ISSO
  lists?: number;           // <-- ADICIONE ISSO
}

interface AuthContextData {
  token: string | null;
  user: User | null; // <-- ADICIONADO
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  // (Opcional) uma função para atualizar o usuário, se necessário
  // updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null); // <-- ADICIONADO
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStoredData() {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUser = await AsyncStorage.getItem('userData'); // <-- ADICIONADO
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser)); // <-- ADICIONADO
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

  const login = async (email: string, senha: string) => {
    try {
      const response = await api.post('/auth/login', { email, senha });
      
      // 2. Capturar AMBOS os dados da resposta
      const { token: newToken, usuario: newUsuario } = response.data;

      // 3. Salvar ambos no estado
      setToken(newToken);
      setUser(newUsuario); // <-- ADICIONADO

      // 4. Configurar a API e salvar no AsyncStorage
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      await AsyncStorage.setItem('userToken', newToken);
      await AsyncStorage.setItem('userData', JSON.stringify(newUsuario)); // <-- ADICIONADO

    } catch (error) {
      console.error('Falha no login', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setToken(null);
      setUser(null); // <-- ADICIONADO
      delete api.defaults.headers.common['Authorization'];
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData'); // <-- ADICIONADO
    } catch (e) {
      console.error('Falha ao deslogar', e);
    }
  };

  return (
    <AuthContext.Provider value={{
      token,
      user, // <-- ADICIONADO
      isAuthenticated: !!token,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}