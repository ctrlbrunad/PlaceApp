import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '../constants/Colors';
import api from '../src/services/api';

// (Reutiliza a interface da tela de estabelecimentos)
interface Estabelecimento { 
  id: string; 
  nome: string; 
  media_notas: string; 
  total_avaliacoes: number; 
  subcategoria: string; 
  images?: string[];
}

export default function MeusFavoritosScreen() {
  const [favoritos, setFavoritos] = useState<Estabelecimento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFavoritos = async () => {
      try {
        setIsLoading(true);
        // Chama a nova rota do backend!
        const response = await api.get('/favoritos/me');
        setFavoritos(response.data);
      } catch (error) {
        console.error("Erro ao buscar favoritos:", error);
        Alert.alert("Erro", "Não foi possível carregar seus favoritos.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavoritos();
  }, []);

  // (renderItem é reutilizado da tela 'estabelecimentos.tsx')
  const renderItem = ({ item }: { item: Estabelecimento }) => {
    const imageUrl = (item.images && item.images.length > 0)
      ? item.images[0]
      : 'https://placeholder.com/100x100.png?text=Sem+Foto';
      
    return (
      <TouchableOpacity 
        style={styles.itemContainer}
        onPress={() => router.push(`/estabelecimento/${item.id}`)}
      >
        <Image source={{ uri: imageUrl }} style={styles.itemImage} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemNome}>{item.nome}</Text>
          <Text style={styles.itemDetalhes}>
            {parseFloat(String(item.media_notas || 0)).toFixed(1)} ★ ({item.total_avaliacoes}) - {item.subcategoria}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ title: 'Carregando...' }} />
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen 
        options={{ 
          title: 'Meus Favoritos',
          headerStyle: { backgroundColor: Colors.background },
          headerTitleStyle: { color: Colors.text, fontWeight: 'bold' },
          headerTintColor: Colors.text,
        }} 
      />
      
      <FlatList
        data={favoritos}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        style={styles.container}
        ListFooterComponent={<View style={{ height: 100 }} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Você ainda não favoritou nenhum local.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// (Estilos reutilizados da tela 'estabelecimentos.tsx')
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  loadingContainer: 
  { flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: Colors.background 
  },
  emptyContainer: 
  { flex: 1, 
    padding: 20, 
    marginTop: 50, 
    alignItems: 'center' 
  },
  emptyText: 
  { fontSize: 16, 
    color: Colors.grey, 
    textAlign: 'center' 
  },
  itemContainer: 
  { flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: Colors.white, 
    padding: 15, 
    marginHorizontal: 15, 
    marginVertical: 8, 
    borderRadius: 12, ...Platform.select({ ios: { shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, }, android: { elevation: 2, }, }), },
  itemImage: { width: 60, height: 60, borderRadius: 8, backgroundColor: Colors.lightGrey, resizeMode: 'cover' },
  itemInfo: { flex: 1, marginLeft: 15 },
  itemNome: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  itemDetalhes: { fontSize: 13, color: Colors.grey },
});