// app/lista/[id].tsx (VERSÃO COM CORREÇÃO DE TIPO 'null')
import { FontAwesome5 } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

  // Função para buscar os dados da API (igual)
  const buscarDetalhesDaLista = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/listas/${id}`);
      setLista(response.data);
    } catch (error) {
      console.error("Erro ao buscar detalhes da lista:", error);
      Alert.alert("Erro", "Não foi possível carregar os detalhes desta lista.");
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect (igual)
  useEffect(() => {
    if (id) {
      buscarDetalhesDaLista();
    }
  }, [id]);

  // --- LÓGICA PARA REMOVER ESTABELECIMENTO (igual) ---
  const handleRemoverEstabelecimento = async (estabelecimentoId: string) => {
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
  };

  // --- LÓGICA PARA DELETAR LISTA (com checagem de 'null') ---
  const handleDeletarLista = async () => {
    // 1. Checagem de segurança para o TypeScript
    if (!lista) {
      Alert.alert("Erro", "A lista não foi carregada.");
      return;
    }

    Alert.alert(
      "Deletar Lista",
      `Tem certeza que deseja deletar a lista "${lista.nome}"?`, // 2. Remove o '?.'
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Deletar", 
          style: "destructive", 
          onPress: async () => {
            try {
              await api.delete(`/listas/${id}`);
              router.back();
            } catch (error) {
              console.error("Erro ao deletar lista:", error);
              Alert.alert("Erro", "Não foi possível deletar a lista.");
            }
          }
        }
      ]
    );
  };

  // renderEstabelecimentoItem (igual)
  const renderEstabelecimentoItem = ({ item }: { item: Estabelecimento }) => (
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
  );

  // --- 3. CORREÇÃO NA LÓGICA DE RENDERIZAÇÃO ---

  // Se estiver carregando
  if (isLoading) {
    return ( 
      <SafeAreaView style={styles.loadingContainer}>
        {/* Mostra um cabeçalho "carregando" para não pular */}
        <Stack.Screen options={{ title: 'Carregando...' }} />
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView> 
    );
  }

  // Se deu erro ou não encontrou
  if (!lista) {
    return ( 
      <SafeAreaView style={styles.loadingContainer}>
        <Stack.Screen options={{ title: 'Erro' }} /> 
        <Text style={styles.emptyText}>Lista não encontrada.</Text>
      </SafeAreaView> 
    );
  }

  // Se 'isLoading' é false E 'lista' existe, renderiza a tela:
  // (O TypeScript agora sabe que 'lista' NÃO é null aqui)
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen 
        options={{ 
          title: lista.nome, // <-- Erro 'possivelmente null' corrigido
          headerRight: () => (
            <TouchableOpacity onPress={handleDeletarLista} style={{ marginRight: 15 }}>
              <FontAwesome5 name="trash-alt" size={20} color={Colors.accentOrange} />
            </TouchableOpacity>
          )
        }} 
      />

      <FlatList
        data={lista.estabelecimentos}
        renderItem={renderEstabelecimentoItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerStatus}>
              {lista.publica ? 'Lista Pública' : 'Lista Privada'} {/* <-- Erro corrigido */}
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

// --- Estilos (iguais) ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  headerStatus: {
    fontSize: 14,
    color: Colors.grey,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.grey,
    textAlign: 'center',
    marginTop: 50,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
  },
  itemImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.lightGrey,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
  },
  itemNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  itemDetalhes: {
    fontSize: 13,
    color: Colors.grey,
  },
  itemRemoveButton: {
    padding: 5,
  }
});