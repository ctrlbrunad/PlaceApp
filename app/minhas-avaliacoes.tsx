import { FontAwesome } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '../constants/Colors';
import api from '../src/services/api';
interface MinhaReview {
  id: string | number;
  nota: number;
  comentario: string;
  data: string;
  estabelecimento_nome: string;
  estabelecimento_id: string;
}

export default function MinhasAvaliacoesScreen() {
  const [reviews, setReviews] = useState<MinhaReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMinhasReviews = async () => {
      try {
        setIsLoading(true);
        // Chama a nova rota do backend que você acabou de criar
        const response = await api.get('/reviews/me');
        setReviews(response.data.data);
      } catch (error) {
        console.error("Erro ao buscar minhas reviews:", error);
        Alert.alert("Erro", "Não foi possível carregar suas avaliações.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMinhasReviews();
  }, []);

  const renderItem = ({ item }: { item: MinhaReview }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      // Permite clicar na avaliação para ir ao estabelecimento
      onPress={() => router.push(`/estabelecimento/${item.estabelecimento_id}`)}
    >
      <View style={styles.itemHeader}>
        <Text style={styles.itemNome}>{item.estabelecimento_nome}</Text>
        <View style={styles.itemNotaContainer}>
          <Text style={styles.itemNota}>{item.nota}</Text>
          <FontAwesome name="star" size={16} color={Colors.primary} />
        </View>
      </View>
      <Text style={styles.itemComentario}>
        {/* Mostra o comentário ou um texto padrão */}
        {item.comentario ? item.comentario : "Nenhum comentário."}
      </Text>
      <Text style={styles.itemData}>
        {/* Formata a data para o padrão Brasil */}
        {new Date(item.data).toLocaleDateString('pt-BR')}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        {/* Adiciona um cabeçalho de "Carregando" */}
        <Stack.Screen 
          options={{ 
            title: 'Carregando...',
            headerStyle: { backgroundColor: Colors.background },
            headerTitleStyle: { color: Colors.text, fontWeight: 'bold' },
          }} 
        />
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Configura o cabeçalho desta tela */}
      <Stack.Screen 
        options={{ 
          title: 'Minhas Avaliações',
          headerStyle: { backgroundColor: Colors.background },
          headerTitleStyle: { color: Colors.text, fontWeight: 'bold' },
          headerTintColor: Colors.text, // Cor da seta "voltar"
        }} 
      />
      
      <FlatList
        data={reviews}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        style={styles.container}
        // Adiciona um espaçamento no final 
        ListFooterComponent={<View style={{ height: 100 }} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Você ainda não fez nenhuma avaliação.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: Colors.background 
  },
  emptyContainer: { 
    flex: 1, 
    padding: 20, 
    marginTop: 50, 
    alignItems: 'center' 
  },
  emptyText: { 
    fontSize: 16, 
    color: Colors.grey, 
    textAlign: 'center' 
  },
  itemContainer: { 
    backgroundColor: Colors.white, 
    padding: 15, 
    marginHorizontal: 15, 
    marginVertical: 8, 
    borderRadius: 12,
    ...Platform.select({ 
      ios: { shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, }, 
      android: { elevation: 2, }, 
    }), 
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemNome: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: Colors.text,
    flex: 1, 
  },
  itemNotaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary}20`, // Fundo laranja claro
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: 10,
  },
  itemNota: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginRight: 4,
  },
  itemComentario: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  itemData: {
    fontSize: 12,
    color: Colors.grey,
    textAlign: 'right',
  },
});