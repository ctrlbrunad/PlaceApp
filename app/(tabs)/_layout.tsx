// app/(tabs)/_layout.tsx (O "MENU DE ABAS")

import { Tabs } from 'expo-router';
import React from 'react';
import Colors from '../../constants/Colors'; // 

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary, // Cor laranja
        tabBarInactiveTintColor: Colors.grey, // Cor cinza
        tabBarStyle: {
          backgroundColor: Colors.white,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ 
          title: 'Home',
          // TODO: Adicionar ícone
        }}
      />
      <Tabs.Screen
        name="estabelecimentos"
        options={{ 
          title: 'Estabelecimentos',
          // TODO: Adicionar ícone
        }}
      />
      <Tabs.Screen
        name="listas"
        options={{ 
          title: 'Listas',
          // TODO: Adicionar ícone
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{ 
          title: 'Perfil',
          // TODO: Adicionar ícone
        }}
      />
    </Tabs>
  );
}