import { FontAwesome, Ionicons } from '@expo/vector-icons';
// --- 1. IMPORTAR 'useRouter' ---
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import Colors from '../../constants/Colors';

// ... (Sua função TabBarIcon está aqui, ela está correta)
type FontAwesomeProps = {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  isIonicons?: false;
}
type IoniconsProps = {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  isIonicons: true;
}
type TabBarIconProps = FontAwesomeProps | IoniconsProps;

function TabBarIcon(props: TabBarIconProps) {
  if (props.isIonicons) {
    return <Ionicons size={28} style={{ marginBottom: -3 }} name={props.name} color={props.color} />;
  }
  return <FontAwesome size={24} style={{ marginBottom: -3 }} name={props.name} color={props.color} />;
}
// ------------------------------------------

export default function TabLayout() {
  const colors = Colors;
  // --- 2. INICIAR O 'router' ---
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary, 
        tabBarInactiveTintColor: colors.grey,  
        tabBarStyle: { 
          backgroundColor: colors.white, 
        },
        headerShown: true, 
        //
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
              isIonicons
            />
          ),
          headerShown: false,
        }}
        // --- 3. ADICIONAR ESTE 'listener' ---
        // Isso intercepta o clique no ícone da aba
        listeners={{
          tabPress: (e) => {
            // Previne a ação padrão (apenas reexibir a tela)
            e.preventDefault(); 
            // Força a navegação para a raiz da aba, limpando o filtro
            router.replace('/(tabs)/estabelecimentos'); 
          },
        }}
      />
      
      {/* Aba Listas */}
      <Tabs.Screen
        name="listas"
        options={{
          title: 'Placelists',
          tabBarIcon: ({ color }) => <TabBarIcon name="list-ul" color={ color } />,
          headerTitle: 'Minhas Placelists', 
    
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
              isIonicons
            />
          ),
        }}
      />
    </Tabs>
  );
}