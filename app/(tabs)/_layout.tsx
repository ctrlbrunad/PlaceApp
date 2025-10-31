// app/(tabs)/_layout.tsx (O "MENU DE ABAS")

import { FontAwesome5 } from '@expo/vector-icons';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native'; // Importa os tipos
import { Tabs } from 'expo-router';
import React from 'react';
import Colors from '../../constants/Colors';

export default function TabLayout() {
  // Tipa o hook de navegação para corrigir os erros de 'never'
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

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
      {/* Aba Home */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" color={color} size={size * 0.9} />
          ),
        }}
      />
      {/* Aba Estabelecimentos */}
      <Tabs.Screen
        name="estabelecimentos"
        options={{
          tabBarLabel: 'Estabelec...',
          headerTitle: 'Estabelecimentos',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="store" color={color} size={size * 0.9} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            const state = navigation.getState();
            if (!state) return; // Checagem de segurança
            const currentRoute = state.routes.find(r => r.name === 'estabelecimentos');
            if (currentRoute && currentRoute.state && (currentRoute.state.routes?.length ?? 0) > 1) {
              e.preventDefault();
              navigation.navigate('estabelecimentos', { params: {}, merge: false });
            }
          },
        }}
      />
      {/* Aba Places (Listas) */}
      <Tabs.Screen
        name="listas"
        options={{
          tabBarLabel: 'Places',
          headerTitle: 'Minhas Listas',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="list-alt" color={color} size={size * 0.9} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            const state = navigation.getState();
            if (!state) return;
            const currentRoute = state.routes.find(r => r.name === 'listas');
            // Se estiver em uma sub-rota (ex: /lista/6), reseta
            if (currentRoute && currentRoute.state && (currentRoute.state.routes?.length ?? 0) > 1) { 
              e.preventDefault();
              navigation.navigate('listas', { params: {}, merge: false });
            }
          },
        }}
      />
      {/* Aba Perfil */}
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