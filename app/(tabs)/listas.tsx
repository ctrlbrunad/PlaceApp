import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
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

import Colors from '../../constants/Colors';
import api from '../../src/services/api';

// Interface para "Minhas Listas"
interface MinhaLista {
  id: string | number;
  nome: string;
  publica: boolean;
}

// Interface para "Listas Públicas"
interface PublicaLista {
  id: string | number;
  nome: string;
  usuario_nome: string;
  total_estabelecimentos: number;
}

export default function PlacelistsScreen() {
  const [minhasListas, setMinhasListas] = useState<MinhaLista[]>([]);
  const [publicListas, setPublicListas] = useState<PublicaLista[]>([]);
  const [activeSegment, setActiveSegment] = useState<'minhas' | 'publicas'>('minhas');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // useEffect (está correto, busca ambos)
  useFocusEffect(
    useCallback(() => {
      const fetchListas = async () => {
        try {
          setIsLoading(true);
          const [minhasRes, publicasRes] = await Promise.all([
            api.get('/listas'),
            api.get('/listas/public') 
          ]); 
          setMinhasListas(minhasRes.data);
          setPublicListas(publicasRes.data);
        } catch (error) {
          console.error("Erro ao buscar Placelists:", error);
          Alert.alert("Erro", "Não foi possível carregar as Placelists.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchListas();
    }, [])
  );

  // Renderizador para "Minhas Listas" (está correto)
  const renderMinhasListasItem = ({ item }: { item: MinhaLista }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => router.push(`/lista/${item.id}`)}
    >
      <View style={styles.itemIcon}>
        <FontAwesome name="list-ul" size={20} color={Colors.primary} />
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemNome}>{item.nome}</Text>
        <Text style={styles.itemDetalhes}>
          {item.publica ? "Pública" : "Privada"}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={Colors.grey} />
    </TouchableOpacity>
  );
  
  // Renderizador para "Listas Públicas" (está correto)
  const renderPublicasListasItem = ({ item }: { item: PublicaLista }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => router.push(`/lista/${item.id}`)}
    >
      <View style={styles.itemIcon}>
        <Ionicons name="people" size={20} color={Colors.primary} />
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemNome}>{item.nome}</Text>
        <Text style={styles.itemDetalhes}>
          Criada por {item.usuario_nome}
        </Text>
      </View>
      <Text style={styles.itemCount}>{item.total_estabelecimentos} locais</Text>
    </TouchableOpacity>
  );

  // Tela de Loading
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // --- CORREÇÃO AQUI ---
  // Trocamos 1 FlatList dinâmico por 2 FlatLists estáticos
  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* Controle Segmentado (igual) */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[styles.segmentButton, activeSegment === 'minhas' && styles.segmentButtonActive]}
          onPress={() => setActiveSegment('minhas')}
        >
          <Text style={[styles.segmentText, activeSegment === 'minhas' && styles.segmentTextActive]}>Minhas Placelists</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentButton, activeSegment === 'publicas' && styles.segmentButtonActive]}
          onPress={() => setActiveSegment('publicas')}
        >
          <Text style={[styles.segmentText, activeSegment === 'publicas' && styles.segmentTextActive]}>Explorar</Text>
        </TouchableOpacity>
      </View>
      
      {/* Se a aba "minhas" estiver ativa, mostra esta lista */}
      {activeSegment === 'minhas' && (
        <FlatList
          data={minhasListas}
          renderItem={renderMinhasListasItem}
          keyExtractor={(item) => String(item.id)}
          style={styles.container}
          ListFooterComponent={<View style={{ height: 100 }} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Você ainda não criou nenhuma Placelist.</Text>
              <Text style={styles.emptySubText}>Clique no '+' para começar!</Text>
            </View>
          }
        />
      )}
      
      {/* Se a aba "publicas" estiver ativa, mostra esta lista */}
      {activeSegment === 'publicas' && (
        <FlatList
          data={publicListas}
          renderItem={renderPublicasListasItem}
          keyExtractor={(item) => String(item.id)}
          style={styles.container}
          ListFooterComponent={<View style={{ height: 100 }} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma Placelist pública encontrada.</Text>
            </View>
          }
        />
      )}

      {/* Botão FAB (igual) */}
      {activeSegment === 'minhas' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/criarLista')}
        >
          <Ionicons name="add" size={32} color={Colors.white} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

// Estilos (os mesmos de antes)
const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },
  container: { 
    flex: 1,
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: Colors.background 
  },
  emptyContainer: { 
    padding: 20, 
    marginTop: 50, 
    alignItems: 'center' 
  },
  emptyText: { 
    fontSize: 16, 
    fontWeight: 'bold',
    color: Colors.text, 
    textAlign: 'center' 
  },
  emptySubText: {
    fontSize: 14, 
    color: Colors.grey, 
    textAlign: 'center',
    marginTop: 5,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, },
      android: { elevation: 2, },
    }),
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonActive: {
    backgroundColor: Colors.text,
    borderRadius: 10,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
  },
  segmentTextActive: {
    color: Colors.white,
  },
  itemContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
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
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: { 
    flex: 1, 
    marginLeft: 15 
  },
  itemNome: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: Colors.text, 
    marginBottom: 4 
  },
  itemDetalhes: { 
    fontSize: 13, 
    color: Colors.grey 
  },
  itemCount: {
    fontSize: 12,
    color: Colors.grey,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 30, 
    right: 20, 
    width: 60,
    height: 60,
    borderRadius: 30, 
    backgroundColor: Colors.primary, 
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, },
      android: { elevation: 6, },
    }),
  },
});