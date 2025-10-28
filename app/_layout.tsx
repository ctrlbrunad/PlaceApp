// app/_layout.tsx (O "PORTEIRO" FINALMENTE CORRIGIDO)

import { Slot, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Colors from '../constants/Colors'; // Importa as cores para o loading
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

    const inAuthGroup = segments.includes('login') || segments.includes('register');
    const isAtRoot = segments.length === 0; // Verifica se estamos na raiz (/)

    // --- LÓGICA DE REDIRECIONAMENTO FINAL ---
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
        // ...e NÃO está no Login/Cadastro, manda pro Login.
        router.replace('/login');
      }
      // Se já está em /login ou /register, não faz nada.
    }

  }, [isAuthenticated, isLoading, segments, router]);

  // Mostra "carregando" SÓ enquanto o AuthContext checa o token
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary}/>
      </View>
    );
  }

  // Mostra a tela correta (Index, Login, ou Home)
  return <Slot />;
}

// O Layout Raiz do App (Envolve o app no "Cérebro")
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
    backgroundColor: Colors.background, // Usa a cor de fundo
  },
});