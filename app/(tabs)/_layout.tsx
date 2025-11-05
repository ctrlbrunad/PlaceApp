// app/(tabs)/_layout.tsx (VERSÃO COM "PLACELIST" E BOTÃO '+')

import { Tabs, useRouter } from 'expo-router';
import React from 'react';
// O caminho correto é 2 níveis acima, pois estamos em app/(tabs)/
import { FontAwesome5 } from '@expo/vector-icons';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native'; // Importa o TouchableOpacity
import Colors from '../../constants/Colors';

export default function TabLayout() {
  const router = useRouter();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  return (
    <Tabs
      screenOptions={{
        // O headerShown agora é controlado por cada tela (Stack.Screen)
        // (Exceto para 'home' e 'perfil' que são simples)
        headerShown: false, 
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.grey,
        tabBarStyle: { backgroundColor: Colors.white },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
      }}
    >
      {/* Aba Home (igual) */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" color={color} size={size * 0.9} />
          ),
        }}
      />
      {/* Aba Estabelecimentos (igual) */}
      <Tabs.Screen
        name="estabelecimentos"
        options={{
          tabBarLabel: 'Places',
          headerTitle: 'Places',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="store" color={color} size={size * 0.9} />
          ),
        }}
        listeners={{
          tabPress: (e) => { // A lógica de "resetar"
            e.preventDefault(); 
            router.push('/estabelecimentos'); 
          },
        }}
      />
      
      {/* --- ABA "LISTAS" ATUALIZADA --- */}
      <Tabs.Screen
        name="listas"
        options={{
          tabBarLabel: 'PlaceList', // 1. NOME MUDOU
          headerTitle: 'Minhas PlaceLists', // Título da página
          headerShown: true, // 2. MOSTRA O CABEÇALHO DA ABA
          headerStyle: { backgroundColor: Colors.background },
          headerTitleStyle: { color: Colors.text, fontWeight: 'bold' },
          headerShadowVisible: false,
          headerTintColor: Colors.text,
          
          // 3. BOTÃO '+' MOVIDO PARA CÁ
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => router.push('/criarLista')} 
              style={{ marginRight: 15 }}
            >
              <FontAwesome5 name="plus" size={22} color={Colors.primary} />
            </TouchableOpacity>
          ),

          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="list-alt" color={color} size={size * 0.9} />
          ),
        }}
        listeners={{
          tabPress: (e) => { // 4. Listener de Reset (igual)
            e.preventDefault();
            router.push('/listas'); 
          },
        }}
      />
      
      {/* Aba Perfil (igual) */}
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