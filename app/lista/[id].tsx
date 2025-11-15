// app/lista/[id].tsx (VERSÃO CORRIGIDA)
import { FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import api from '../../src/services/api';

// --- 1. IMPORTAR O 'useAuth' ---
import { useAuth } from '../../src/context/AuthContext';

// ... (Interface Estabelecimento e ListaDetalhada - permanecem iguais)
interface Estabelecimento { 
  id: string; 
  nome: string; 
  categoria: string; 
  subcategoria: string; 
  endereco: string; 
  media_notas: string; 
  total_avaliacoes: number; 
  images?: string[];
}
interface ListaDetalhada {
  id: number;
  nome: string;
  publica: boolean;
  usuario_id: string; // ID do dono da lista
  usuario_nome: string;
  estabelecimentos: Estabelecimento[];
}

export default function ListaDetalheScreen() {
  const [lista, setLista] = useState<ListaDetalhada | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();

  // --- 2. PEGAR O USUÁRIO LOGADO ---
  const { user } = useAuth(); // Pega o 'user' do AuthContext

  // ... (buscarDetalhesDaLista, handleDeletarLista, useLayoutEffect, handleRemoverEstabelecimento
  //     permanecem os mesmos.tsx])
  const buscarDetalhesDaLista = async () => { setIsLoading(true); try { const response = await api.get(`/listas/${id}`); setLista(response.data); } catch (error) { console.error("Erro...", error); Alert.alert("Erro", "Não..."); } finally { setIsLoading(false); } };
  useEffect(() => { if (id) { buscarDetalhesDaLista(); } }, [id]);

  const handleDeletarLista = useCallback(async () => {
    if (!lista) return;
    Alert.alert( "Deletar Lista", `Tem certeza... "${lista.nome}"?`, [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Deletar", 
          style: "destructive", 
          onPress: async () => {
            try {
              await api.delete(`/listas/${id}`);
              router.back();
            } catch (error) {
              console.error("Erro ao deletar:", error);
              Alert.alert("Erro", "Não foi possível deletar.");
            }
          }
        }
    ]);
  }, [lista, id, router]);

  useLayoutEffect(() => {
    if (!lista) {
      navigation.setOptions({ title: isLoading ? 'Carregando...' : 'Erro' });
      return;
    }
    navigation.setOptions({
      title: lista.nome, 
     
    });
  }, [navigation, lista, isLoading, handleDeletarLista]);

  const handleRemoverEstabelecimento = useCallback(async (estabelecimentoId: string) => { 
    try {
      await api.delete(`/listas/${id}/estabelecimentos/${estabelecimentoId}`);
      setLista(currentLista => {
        if (!currentLista) return null;
        const novosEstabelecimentos = currentLista.estabelecimentos.filter(
          est => est.id !== estabelecimentoId
        );
        return { ...currentLista, estabelecimentos: novosEstabelecimentos };
      });
    } catch (error) {
      console.error("Erro ao remover estabelecimento:", error);
      Alert.alert("Erro", "Não foi possível remover o estabelecimento.");
    }
   }, [id]);

  
  const renderEstabelecimentoItem = useCallback(({ item }: { item: Estabelecimento }) => {
    
    const imageUrl = (item.images && item.images.length > 0)
      ? item.images[0]
      : 'https://placeholder.com/100x100.png?text=Sem+Foto';

    // --- 3. VERIFICAR SE O USUÁRIO É O DONO DA LISTA ---
    const isOwner = user && lista && user.id === lista.usuario_id;

    return (
      <View style={styles.itemContainer}>
        <Image source={{ uri: imageUrl }} style={styles.itemImage} />
        
        <View style={styles.itemInfo}>
          <Text style={styles.itemNome}>{item.nome}</Text>
          <Text style={styles.itemDetalhes}>{item.subcategoria}</Text>
        </View>

        {/* --- 4. SÓ MOSTRAR O "X" SE FOR O DONO --- */}
        {isOwner && (
          <TouchableOpacity 
            style={styles.itemRemoveButton}
            onPress={() => handleRemoverEstabelecimento(item.id)}
          >
            <FontAwesome5 name="times-circle" size={24} color={Colors.grey} />
          </TouchableOpacity>
        )}
      </View>
    );
  // --- 5. ADICIONAR 'user' E 'lista' ÀS DEPENDÊNCIAS DO 'useCallback' ---
  }, [handleRemoverEstabelecimento, user, lista]); 

  // ... (lógica de renderização de loading/vazio)
  if (isLoading) {
    return ( <SafeAreaView style={styles.loadingContainer}><ActivityIndicator size="large" color={Colors.primary} /></SafeAreaView> );
  }
  if (!lista) {
    return ( <SafeAreaView style={styles.loadingContainer}><Text style={styles.emptyText}>Lista não encontrada.</Text></SafeAreaView> );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={lista.estabelecimentos}
        renderItem={renderEstabelecimentoItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerStatus}>
              {lista.publica ? 'Lista Pública' : 'Lista Privada'} · Criada por {lista.usuario_nome}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Esta lista ainda não tem nenhum local.</Text>
        }
      />
    </SafeAreaView>
  );
}

// Estilos (os mesmos da última correção)
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  header: { paddingVertical: 10, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: Colors.lightGrey },
  headerStatus: { fontSize: 14, color: Colors.grey },
  emptyText: { fontSize: 16, color: Colors.grey, textAlign: 'center', marginTop: 50 },
  itemContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, padding: 15, marginHorizontal: 15, marginVertical: 8, borderRadius: 12 },
  itemImage: { 
    width: 60, 
    height: 60, 
    borderRadius: 8, 
    backgroundColor: Colors.lightGrey,
    resizeMode: 'cover',
  },
  itemInfo: { flex: 1, marginLeft: 15 },
  itemNome: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  itemDetalhes: { fontSize: 13, color: Colors.grey },
  itemRemoveButton: { padding: 5 }
});