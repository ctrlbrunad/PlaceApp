import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import Colors from '../../constants/Colors';

// --- ESTA É A FUNÇÃO CORRIGIDA ---
// Esta definição de tipo é mais avançada e diz ao TypeScript
// que se 'isIonicons' for true, 'name' DEVE ser um ícone do Ionicons,
// e se for false (ou não existir), 'name' DEVE ser um ícone do FontAwesome.
// Isso resolve o erro "Type 'string' is not assignable..."

// 1. Define os tipos de props separadamente
type FontAwesomeProps = {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  isIonicons?: false; // 'isIonicons' é falso ou indefinido
}
type IoniconsProps = {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  isIonicons: true; // 'isIonicons' é verdadeiro
}

// 2. O tipo final do nosso componente é uma união dos dois
type TabBarIconProps = FontAwesomeProps | IoniconsProps;

// 3. A função agora usa os tipos corretos
function TabBarIcon(props: TabBarIconProps) {
  if (props.isIonicons) {
    // Se 'isIonicons' é true, TypeScript agora SABE que 'props.name' é um nome de Ionicons.
    return <Ionicons size={28} style={{ marginBottom: -3 }} name={props.name} color={props.color} />;
  }
  // Se 'isIonicons' é false, TypeScript agora SABE que 'props.name' é um nome de FontAwesome.
  return <FontAwesome size={24} style={{ marginBottom: -3 }} name={props.name} color={props.color} />;
}
// ------------------------------------------

export default function TabLayout() {
  const colors = Colors;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary, 
        tabBarInactiveTintColor: colors.grey,  
        tabBarStyle: { 
          backgroundColor: colors.white, 
        },
        headerShown: true, // Importante para o menu do perfil
      }}>
      
      {/* Aba Home */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} isIonicons />,
          headerShown: false, 
        }}
      />

      {/* Aba Estabelecimentos (Places) */}
      <Tabs.Screen
        name="estabelecimentos"
        options={{
          title: 'Places', 
          tabBarIcon: ({ color }) => (
            <TabBarIcon 
              name="storefront-outline" 
              color={color} 
              isIonicons // Esta prop 'isIonicons: true' agora corresponde ao tipo IoniconsProps
            />
          ),
          headerShown: false,
        }}
      />
      
      {/* Aba Listas */}
      <Tabs.Screen
        name="listas"
        options={{
          title: 'Listas',
          // Esta chamada corresponde ao tipo FontAwesomeProps (isIonicons é indefinido)
          tabBarIcon: ({ color }) => <TabBarIcon name="list-ul" color={color} />,
          headerTitle: 'Minhas Listas', 
        }}
      />
      
      {/* Aba Perfil */}
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <TabBarIcon 
              name="person" 
              color={color} 
              isIonicons // Esta prop 'isIonicons: true' corresponde ao tipo IoniconsProps
            />
          ),
        }}
      />
    </Tabs>
  );
}