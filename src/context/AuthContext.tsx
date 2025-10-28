// src/context/AuthContext.tsx (VERSÃO CORRIGIDA)

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

// Define o que o nosso contexto vai ter
interface AuthContextData {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  // --- CORREÇÃO AQUI ---
  // Precisamos definir os tipos dos parâmetros
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

// Cria o contexto
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Cria o "Provedor" que vai envolver nosso app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Começa carregando

  // Efeito que roda UMA VEZ quando o app abre
  useEffect(() => {
    async function loadToken() {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
          setToken(storedToken);
          // Coloca o token no cabeçalho do 'api' para futuras requisições
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
      } catch (e) {
        console.error('Falha ao carregar o token', e);
      } finally {
        setIsLoading(false); // Termina de carregar
      }
    }
    loadToken();
  }, []);

  // Função de Login
   const login = async (email: string, senha: string) => {
    try {
      const response = await api.post('/auth/login', { email, senha });
      const { token: newToken } = response.data;

      setToken(newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      await AsyncStorage.setItem('userToken', newToken);
    } catch (error) {
      console.error('Falha no login', error);
      throw error; // Lança o erro para a tela de login mostrar o alerta
    }
  };

  // Função de Logout
  const logout = async () => {
    try {
      setToken(null);
      delete api.defaults.headers.common['Authorization'];
      await AsyncStorage.removeItem('userToken');
    } catch (e) {
      console.error('Falha ao deslogar', e);
    }
  };

  return (
    <AuthContext.Provider value={{
      token,
      isAuthenticated: !!token, // Se o token não for nulo, está autenticado
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}