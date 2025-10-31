// app/_layout.tsx (VERSÃO COM LÓGICA DE REDIRECIONAMENTO FINALMENTE CORRIGIDA)

import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

// Caminhos corretos (um nível acima)
import Colors from '../constants/Colors';
import { AuthProvider, useAuth } from '../src/context/AuthContext';

// O "Porteiro" em si
function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments() as string[]; 

  useEffect(() => {
    if (isLoading) {
      return; // Espera o AuthContext carregar
    }

    // Define quais rotas são "públicas" (do grupo auth)
    const inAuthGroup = segments.includes('login') || segments.includes('register');
    // Verifica se estamos na raiz (/)
    const isAtRoot = segments.length === 0; 

    // --- LÓGICA DE REDIRECIONAMENTO CORRIGIDA ---
    if (isAuthenticated) {
      // Se está logado...
      if (inAuthGroup || isAtRoot) {
        // ...e está no Login/Cadastro OU na raiz, manda pro Home.
        router.replace('/home');
      }
      // Se já está em /home ou outra tela logada, não faz nada.
      
    } else {
      // Se NÃO está logado...
      if (!inAuthGroup) {
        // ...e NÃO está no Login/Cadastro (ex: está na raiz '/'), manda pro Login.
        router.replace('/login');
      }
      // Se já está em /login ou /register, não faz nada.
    }

  }, [isAuthenticated, isLoading, segments, router]);

  // Tela de "carregando" (mostra enquanto 'isLoading' é true)
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary}/>
      </View>
    );
  }

  // Define o Stack Navigator (com todas as suas rotas)
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" /> 
      <Stack.Screen name="(tabs)" />
      
      {/* Tela Modal 'criarLista' */}
      <Stack.Screen 
        name="criarLista"
        options={{ 
          headerShown: true, title: 'Criar Nova Lista', presentation: 'modal',
          headerStyle: { backgroundColor: Colors.background },
          headerTitleStyle: { color: Colors.text, fontWeight: 'bold' },
          headerTintColor: Colors.text,
        }} 
      />
      
      {/* Tela de Detalhes da Lista */}
      <Stack.Screen 
        name="lista/[id]"
        options={{ 
          headerShown: true,
          headerStyle: { backgroundColor: Colors.background },
          headerTitleStyle: { color: Colors.text, fontWeight: 'bold' },
          headerTintColor: Colors.text,
        }} 
      />
      
      {/* Tela de Detalhes do Estabelecimento */}
      <Stack.Screen 
        name="estabelecimento/[id]"
        options={{ 
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerTintColor: Colors.text,
        }} 
      />
    </Stack>
  );
}

// O Layout Raiz (com o Provider)
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});