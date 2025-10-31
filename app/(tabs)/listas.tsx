// app/(tabs)/listas.tsx (VERSÃO COM CORREÇÃO DE <Link>)
import { FontAwesome5 } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
// --- 1. IMPORTA O <Link> ---
import { Link, Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import { useAuth } from '../../src/context/AuthContext';
import api from '../../src/services/api';

// Interface (igual)
interface Lista { id: number; nome: string; publica: boolean; }

export default function ListasScreen() {
  const [listas, setListas] = useState<Lista[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();
  const router = useRouter(); // Ainda usamos para o 'criarLista'
  const isFocused = useIsFocused();

  // useEffect (igual)
  const buscarListas = async () => { /* ... (código igual) ... */ setIsLoading(true); try { const response = await api.get('/listas'); setListas(response.data); } catch (error) { console.error("Erro...", error); Alert.alert("Erro", "Não..."); } finally { setIsLoading(false); } };
  useEffect(() => { if (isFocused && token) { buscarListas(); } else if (!token) { setIsLoading(false); } }, [token, isFocused]);

  // handleCriarLista (igual)
  const handleCriarLista = () => {
    router.push('/criarLista');
  };

  // --- 2. RENDER ITEM ATUALIZADO COM <Link> ---
  const renderItem = ({ item }: { item: Lista }) => (
    // 'href' usa um objeto para passar o 'id' como parâmetro
    // 'asChild' diz ao Link para "passar" o clique para o seu filho (o TouchableOpacity)
    <Link 
      href={{
        pathname: "/lista/[id]",
        params: { id: item.id }
      }} 
      asChild
    >
      {/* O onPress foi removido, o Link agora cuida disso */}
      <TouchableOpacity style={styles.listItem}>
        <Text style={styles.listNome}>{item.nome}</Text>
        <Text style={styles.listStatus}>{item.publica ? 'Pública' : 'Privada'}</Text>
      </TouchableOpacity>
    </Link>
  );

  // if (isLoading) (igual)
  if (isLoading && listas.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Stack.Screen options={{ headerShown: true, title: 'Minhas Listas' }} />
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Stack.Screen (igual) */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Minhas Listas',
          headerStyle: { backgroundColor: Colors.background },
          headerTitleStyle: { color: Colors.text, fontWeight: 'bold' },
          headerShadowVisible: false, headerTintColor: Colors.text,
          headerRight: () => (
            <TouchableOpacity onPress={handleCriarLista} style={{ marginRight: 15 }}>
              <FontAwesome5 name="plus" size={22} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      
      {/* A Lista (igual) */}
      {listas.length === 0 ? (
        <Text style={styles.emptyText}>Você ainda não criou nenhuma lista.</Text>
      ) : (
        <FlatList
          data={listas}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          onRefresh={buscarListas}
          refreshing={isLoading}
        />
      )}
    </SafeAreaView>
  );
}

// Estilos (iguais)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  listItem: { backgroundColor: Colors.white, padding: 15, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: Colors.lightGrey, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, },
  listNome: { fontSize: 18, color: Colors.text },
  listStatus: { fontSize: 14, color: Colors.grey },
  emptyText: { fontSize: 16, color: Colors.grey, textAlign: 'center', marginTop: 50 },
});