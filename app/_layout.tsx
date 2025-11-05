// app/_layout.tsx (VERSÃO FINAL CORRIGIDA)

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
    if (isLoading) return; 

    const inAuthGroup = segments.includes('login') || segments.includes('register');
    const isAtRoot = segments.length === 0;
    const isProtectedRoute = !inAuthGroup; 

    if (isAuthenticated) {
      if (inAuthGroup || isAtRoot) {
        router.replace('/home');
      }
    } else {
      if (isProtectedRoute) {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, segments, router]);

  // Tela de "carregando"
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary}/>
      </View>
    );
  }

  // Define o Stack Navigator
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
          headerShown: true, headerTransparent: true,
          headerTitle: '', headerTintColor: Colors.text,
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