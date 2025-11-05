// app/lista/[id].tsx (VERSÃO COM CAMINHOS CORRIGIDOS)
import { FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// --- CAMINHOS CORRIGIDOS (DOIS NÍVEIS ACIMA) ---
import Colors from '../../constants/Colors';
import api from '../../src/services/api';

// Interfaces (iguais)
interface Estabelecimento { id: string; nome: string; categoria: string; subcategoria: string; endereco: string; media_notas: string; total_avaliacoes: number; }
interface ListaDetalhada {
  id: number;
  nome: string;
  publica: boolean;
  usuario_id: string;
  usuario_nome: string;
  estabelecimentos: Estabelecimento[];
}

export default function ListaDetalheScreen() {
  const [lista, setLista] = useState<ListaDetalhada | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();

  // Função para buscar os dados (igual)
  const buscarDetalhesDaLista = async () => { setIsLoading(true); try { const response = await api.get(`/listas/${id}`); setLista(response.data); } catch (error) { console.error("Erro...", error); Alert.alert("Erro", "Não..."); } finally { setIsLoading(false); } };
  useEffect(() => { if (id) { buscarDetalhesDaLista(); } }, [id]);

  // Função Deletar Lista (com useCallback)
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

  // Define o cabeçalho dinamicamente
  useLayoutEffect(() => {
    if (!lista) {
      navigation.setOptions({ title: isLoading ? 'Carregando...' : 'Erro' });
      return;
    }
    navigation.setOptions({
      title: lista.nome, // Define o título da tela
      headerRight: () => ( // Adiciona o botão de lixeira
        <TouchableOpacity onPress={handleDeletarLista} style={{ marginRight: 15 }}>
          <FontAwesome5 name="trash-alt" size={20} color={Colors.accentOrange} />
        </TouchableOpacity>
      )
    });
  }, [navigation, lista, isLoading, handleDeletarLista]);

  // Função Remover Estabelecimento (com useCallback)
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

  // renderEstabelecimentoItem (com useCallback)
  const renderEstabelecimentoItem = useCallback(({ item }: { item: Estabelecimento }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemImagePlaceholder} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemNome}>{item.nome}</Text>
        <Text style={styles.itemDetalhes}>{item.subcategoria}</Text>
      </View>
      <TouchableOpacity 
        style={styles.itemRemoveButton}
        onPress={() => handleRemoverEstabelecimento(item.id)}
      >
        <FontAwesome5 name="times-circle" size={24} color={Colors.grey} />
      </TouchableOpacity>
    </View>
  ), [handleRemoverEstabelecimento]);

  // Lógica de Renderização (simplificada)
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
              {lista.publica ? 'Lista Pública' : 'Lista Privada'}
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

// --- CONSTANTE 'styles' ADICIONADA DE VOLTA ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  header: { paddingVertical: 10, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: Colors.lightGrey },
  headerStatus: { fontSize: 14, color: Colors.grey },
  emptyText: { fontSize: 16, color: Colors.grey, textAlign: 'center', marginTop: 50 },
  itemContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, padding: 15, marginHorizontal: 15, marginVertical: 8, borderRadius: 12 },
  itemImagePlaceholder: { width: 60, height: 60, borderRadius: 8, backgroundColor: Colors.lightGrey },
  itemInfo: { flex: 1, marginLeft: 15 },
  itemNome: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  itemDetalhes: { fontSize: 13, color: Colors.grey },
  itemRemoveButton: { padding: 5 }
});