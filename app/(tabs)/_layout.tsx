// app/(tabs)/_layout.tsx (VERSÃO COM O RESET CORRIGIDO USANDO 'useRouter')

import React from 'react';
// --- 1. IMPORTA 'useRouter' E 'Tabs' (NÃO 'useNavigation') ---
import { FontAwesome5 } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
// Não precisamos mais do 'useNavigation' ou 'ParamListBase'

export default function TabLayout() {
  // --- 2. USA O 'useRouter' DO EXPO ---
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.grey,
        tabBarStyle: { backgroundColor: Colors.white },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" color={color} size={size * 0.9} />
          ),
        }}
      />
      <Tabs.Screen
        name="estabelecimentos"
        options={{
          tabBarLabel: 'Estabelec...',
          headerTitle: 'Estabelecimentos',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="store" color={color} size={size * 0.9} />
          ),
        }}
        // --- 3. LISTENER SIMPLIFICADO ---
        listeners={{
          tabPress: (e) => {
            // Previne o comportamento padrão (que é só focar na aba atual)
            e.preventDefault(); 
            
            // Força a navegação para a rota base, limpando os query params
            // Isso vai recarregar a tela 'estabelecimentos.tsx' sem o
            // '?categoria=Pizzaria'
            router.push('/estabelecimentos'); 
          },
        }}
      />
      <Tabs.Screen
        name="listas"
        options={{
          title: 'Listas',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="list-alt" color={color} size={size * 0.9} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user" color={color} size={size * 0.9} solid />
          ),
        }}
      />
    </Tabs>
  );
}