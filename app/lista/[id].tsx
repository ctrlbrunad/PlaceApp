import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
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
import { useAuth } from '../../src/context/AuthContext';
import api from '../../src/services/api';

// Interfaces
interface Estabelecimento { 
  id: string; nome: string; categoria: string; subcategoria: string; endereco: string; media_notas: string; total_avaliacoes: number; images?: string[];
}
interface ListaDetalhada {
  id: number;
  nome: string;
  descricao?: string;
  publica: boolean;
  usuario_id: string;
  usuario_nome: string;
  estabelecimentos: Estabelecimento[];
  favoritada?: boolean; // <-- NOVO CAMPO
}

export default function ListaDetalheScreen() {
  const [lista, setLista] = useState<ListaDetalhada | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useAuth(); 

  const buscarDetalhesDaLista = async () => { 
    setIsLoading(true); 
    try { 
      const response = await api.get(`/listas/${id}`); 
      setLista(response.data); 
    } catch (error) { 
      console.error("Erro...", error); 
      Alert.alert("Erro", "Não foi possível carregar a lista."); 
    } finally { 
      setIsLoading(false); 
    } 
  };

  useEffect(() => { if (id) { buscarDetalhesDaLista(); } }, [id]);

  // --- FUNÇÃO DE FAVORITAR ---
  const handleToggleFavorito = async () => {
    if (!lista) return;
    
    // Otimista
    const novoStatus = !lista.favoritada;
    setLista(prev => prev ? { ...prev, favoritada: novoStatus } : null);

    try {
      await api.post(`/listas/${id}/favoritar`);
    } catch (error) {
      console.error(error);
      setLista(prev => prev ? { ...prev, favoritada: !novoStatus } : null); // Reverte
    }
  };

  // ... (handleDeletarLista, useLayoutEffect - permanecem iguais)
  const handleDeletarLista = useCallback(async () => {
    if (!lista) return;
    Alert.alert("Deletar Lista", `Tem certeza... "${lista.nome}"?`, [ { text: "Cancelar", style: "cancel" }, { text: "Deletar", style: "destructive", onPress: async () => { try { await api.delete(`/listas/${id}`); router.back(); } catch (error) { Alert.alert("Erro", "Erro ao deletar."); } } }]);
  }, [lista, id, router]);

  useLayoutEffect(() => {
    if (!lista) {
      navigation.setOptions({ title: isLoading ? 'Carregando...' : 'Erro' });
      return;
    }
    const isOwner = user && user.id === lista.usuario_id;

    navigation.setOptions({
      title: lista.nome,
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
            {/* Se for DONO: Lixeira */}
            {isOwner && (
                <TouchableOpacity onPress={handleDeletarLista} style={{ padding: 5 }}>
                    <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
            )}
            
            {/* Se NÃO for dono (Lista Pública): Coração */}
            {!isOwner && (
                <TouchableOpacity onPress={handleToggleFavorito} style={{ padding: 5 }}>
                    <Ionicons 
                        name={lista.favoritada ? "heart" : "heart-outline"} 
                        size={24} 
                        color={lista.favoritada ? Colors.primary : Colors.text} 
                    />
                </TouchableOpacity>
            )}
        </View>
      ),
    });
  }, [navigation, lista, isLoading, handleDeletarLista, user]);
  // ...

  // O resto do código (renderItem, etc.) permanece igual.
  // Vou resumir aqui para economizar espaço, mas o JSX do renderItem e do return 
  // é idêntico ao anterior.

  const handleRemoverEstabelecimento = useCallback(async (estabelecimentoId: string) => { 
    try {
      await api.delete(`/listas/${id}/estabelecimentos/${estabelecimentoId}`);
      setLista(currentLista => {
        if (!currentLista) return null;
        const novosEstabelecimentos = currentLista.estabelecimentos.filter(est => est.id !== estabelecimentoId);
        return { ...currentLista, estabelecimentos: novosEstabelecimentos };
      });
    } catch (error) { Alert.alert("Erro", "Erro ao remover."); }
   }, [id]);
  
  const renderEstabelecimentoItem = useCallback(({ item }: { item: Estabelecimento }) => {
    const imageUrl = (item.images && item.images.length > 0) ? item.images[0] : 'https://placeholder.com/100x100.png?text=Sem+Foto';
    const isOwner = user && lista && user.id === lista.usuario_id;
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity style={styles.itemContentClickable} onPress={() => router.push(`/estabelecimento/${item.id}`)}>
            <Image source={{ uri: imageUrl }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
            <Text style={styles.itemNome}>{item.nome}</Text>
            <Text style={styles.itemDetalhes}>{item.subcategoria}</Text>
            </View>
        </TouchableOpacity>
        {isOwner && (
          <TouchableOpacity style={styles.itemRemoveButton} onPress={() => handleRemoverEstabelecimento(item.id)}>
            <FontAwesome5 name="times-circle" size={24} color={Colors.grey} />
          </TouchableOpacity>
        )}
      </View>
    );
  }, [handleRemoverEstabelecimento, user, lista, router]); 

  if (isLoading) return ( <SafeAreaView style={styles.loadingContainer}><ActivityIndicator size="large" color={Colors.primary} /></SafeAreaView> );
  if (!lista) return ( <SafeAreaView style={styles.loadingContainer}><Text style={styles.emptyText}>Lista não encontrada.</Text></SafeAreaView> );

  const isOwner = user && lista && user.id === lista.usuario_id;

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
            {lista.descricao ? (<Text style={styles.headerDescription}>{lista.descricao}</Text>) : null}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Esta lista ainda não tem nenhum local.</Text>
            {isOwner && (<Text style={styles.emptySubText}>Clique no '+' para procurar locais.</Text>)}
          </View>
        }
      />
      {isOwner && (
        <TouchableOpacity style={styles.fab} onPress={() => router.push('/(tabs)/estabelecimentos')}>
          <Ionicons name="add" size={32} color={Colors.white} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  header: { paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: Colors.lightGrey },
  headerStatus: { fontSize: 14, color: Colors.grey, marginBottom: 5 },
  headerDescription: { fontSize: 16, color: Colors.text, fontStyle: 'italic', lineHeight: 22 },
  emptyContainer: { alignItems: 'center', marginTop: 50, paddingHorizontal: 20 },
  emptyText: { fontSize: 16, color: Colors.grey, textAlign: 'center' },
  emptySubText: { fontSize: 14, color: Colors.grey, textAlign: 'center', marginTop: 5 },
  itemContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, padding: 15, marginHorizontal: 15, marginVertical: 8, borderRadius: 12 },
  itemContentClickable: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  itemImage: { width: 60, height: 60, borderRadius: 8, backgroundColor: Colors.lightGrey, resizeMode: 'cover' },
  itemInfo: { flex: 1, marginLeft: 15 },
  itemNome: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  itemDetalhes: { fontSize: 13, color: Colors.grey },
  itemRemoveButton: { padding: 10 },
  fab: { position: 'absolute', bottom: 30, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', ...Platform.select({ ios: { shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3 }, android: { elevation: 6 }, }), },
});