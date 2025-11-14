import { Ionicons } from '@expo/vector-icons'; // --- 1. IMPORTAR Ionicons ---
import { Link, Stack, useLocalSearchParams } from 'expo-router';
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
import Colors from '../../constants/Colors';
import api from '../../src/services/api';

// Interface (incluindo 'images')
interface Estabelecimento { 
  id: string; 
  nome: string; 
  media_notas: string; 
  total_avaliacoes: number; 
  subcategoria: string; 
  images?: string[];
}

export default function EstabelecimentosScreen() {
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- 2. CRIAR ESTADO PARA OS FAVORITOS ---
  // Usamos um 'Set' para performance de busca (ex: favoritos.has('estab123'))
  const [favoritos, setFavoritos] = useState<Set<string>>(new Set());
  
  const { categoria, search } = useLocalSearchParams<{ categoria: string, search: string }>();
  const tituloDaTela = categoria || (search ? `Busca por "${search}"` : "Estabelecimentos");

  // --- 3. ATUALIZAR O useEffect PARA BUSCAR FAVORITOS TAMBÉM ---
  useEffect(() => {
    const buscarDados = async () => { 
      setIsLoading(true); 
      
      let endpoint = '/estabelecimentos'; 
      if (categoria) {
        endpoint = `/estabelecimentos/top10/${categoria}`;
      } else if (search) {
        endpoint = `/estabelecimentos?search=${search}`;
      }
      
      try { 
        // Busca os estabelecimentos E os IDs de favoritos em paralelo
        const [estabResponse, favIdsResponse] = await Promise.all([
          api.get<Estabelecimento[]>(endpoint),
          api.get<string[]>('/favoritos/me/ids') // Nova rota do backend
        ]);
        
        setEstabelecimentos(estabResponse.data);
        setFavoritos(new Set(favIdsResponse.data)); // Salva os IDs no estado

      } catch (error) { 
        console.error(`Erro...`, error); 
        Alert.alert("Erro", "Não foi..."); 
      } finally { 
        setIsLoading(false); 
      } 
    };
    buscarDados();
  }, [categoria, search]);

  // --- 4. ADICIONAR A FUNÇÃO DE TOGGLE (LIGAR/DESLIGAR) ---
  const handleToggleFavorito = async (estabelecimentoId: string) => {
    // Atualização Otimista: muda o ícone ANTES da resposta da API
    const novosFavoritos = new Set(favoritos);
    if (novosFavoritos.has(estabelecimentoId)) {
      novosFavoritos.delete(estabelecimentoId);
    } else {
      novosFavoritos.add(estabelecimentoId);
    }
    setFavoritos(novosFavoritos);

    // Envia a requisição real para a API (toggle)
    try {
      await api.post(`/favoritos/${estabelecimentoId}`);
    } catch (error) {
      console.error("Erro ao favoritar:", error);
      // Se a API falhar, reverte a mudança visual
      setFavoritos(new Set(favoritos)); 
    }
  };

  // --- 5. ATUALIZAR O renderItem PARA USAR O CORAÇÃO ---
  const renderItem = ({ item }: { item: Estabelecimento }) => {
    const imageUrl = (item.images && item.images.length > 0)
      ? item.images[0]
      : 'https://placeholder.com/100x100.png?text=Sem+Foto';
      
    // Verifica se o item atual está no Set de favoritos
    const isFavorited = favoritos.has(item.id);
      
    return (
      // O container principal não é mais um Link
      <View style={styles.itemContainer}>
        {/* O Link agora envolve apenas a parte da informação */}
        <Link 
          href={{
            pathname: "/estabelecimento/[id]",
            params: { id: item.id }
          }} 
          asChild
        >
          <TouchableOpacity style={styles.itemLink}>
            <Image source={{ uri: imageUrl }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemNome}>{item.nome}</Text>
              <Text style={styles.itemDetalhes}>
                {parseFloat(String(item.media_notas || 0)).toFixed(1)} ★ ({item.total_avaliacoes}) - {item.subcategoria}
              </Text>
            </View>
          </TouchableOpacity>
        </Link>

        {/* O placeholder foi substituído pelo botão de coração */}
        <TouchableOpacity 
          style={styles.itemSalvarButton}
          onPress={() => handleToggleFavorito(item.id)}
        >
          <Ionicons 
            name={isFavorited ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorited ? Colors.primary : Colors.grey} 
          />
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) { 
    return ( 
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView> 
    ); 
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ 
        headerShown: true,
        headerTitle: tituloDaTela.toUpperCase(),
        headerStyle: { backgroundColor: Colors.background },
        headerTitleStyle: { color: Colors.text, fontWeight: 'bold' },
        headerShadowVisible: false, headerTintColor: Colors.text,
      }} />

      <FlatList
        data={estabelecimentos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.container}
        ListFooterComponent={<View style={{ height: 100 }} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {categoria ? `Nenhum estabelecimento encontrado para "${categoria}".` 
               : search ? `Nenhum resultado para "${search}".`
               : "Nenhum estabelecimento encontrado."}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// --- 6. ATUALIZAR OS ESTILOS ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  emptyContainer: { flex: 1, padding: 20, marginTop: 50, alignItems: 'center' },
  emptyText: { fontSize: 16, color: Colors.grey, textAlign: 'center' },
  itemContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, padding: 15, marginHorizontal: 15, marginVertical: 8, borderRadius: 12, ...Platform.select({ ios: { shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, }, android: { elevation: 2, }, }), },
  
  // Novo estilo para o 'Link' (imagem + texto)
  itemLink: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10, // Adiciona margem para não colar no coração
  },

  itemImage: { 
    width: 60, 
    height: 60, 
    borderRadius: 8, 
    backgroundColor: Colors.lightGrey,
    resizeMode: 'cover',
  },
  itemInfo: { flex: 1, marginLeft: 15 },
  itemNome: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  itemDetalhes: { fontSize: 13, color: Colors.grey },
  
  // Novo estilo para o botão de coração
  itemSalvarButton: { 
    padding: 5, // Aumenta a área de clique
  },
  // (itemSalvarPlaceholder foi removido)
});