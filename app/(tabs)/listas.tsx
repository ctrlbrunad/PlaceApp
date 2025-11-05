// app/(tabs)/listas.tsx (VERSÃO FINAL COM MODAL DE DELETAR)
import { FontAwesome5 } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { Link, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal'; // <-- 1. IMPORTA O MODAL
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import { useAuth } from '../../src/context/AuthContext';
import api from '../../src/services/api';

// Interface (igual)
interface Lista { id: number; nome: string; publica: boolean; }

export default function ListasScreen() {
  const [listas, setListas] = useState<Lista[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false); // <-- 2. Estado para o modal
  const [listaParaDeletar, setListaParaDeletar] = useState<Lista | null>(null); // <-- 3. Estado para saber QUAL lista deletar

  const { token } = useAuth();
  const router = useRouter(); 
  const isFocused = useIsFocused();

  // Função para buscar as listas (igual)
  const buscarListas = async () => { /* ... (código igual) ... */ setIsLoading(true); try { const response = await api.get('/listas'); setListas(response.data); } catch (error) { console.error("Erro...", error); Alert.alert("Erro", "Não..."); } finally { setIsLoading(false); } };
  useEffect(() => { if (isFocused && token) { buscarListas(); } else if (!token) { setIsLoading(false); } }, [token, isFocused]);

  // handleCriarLista (igual)
  const handleCriarLista = () => { router.push('/criarLista'); };

  // --- 4. FUNÇÕES DE DELETAR ATUALIZADAS PARA O MODAL ---
  
  // Esta é chamada pelo botão "Deletar" DENTRO do modal
  const handleConfirmarDelecao = async () => {
    if (!listaParaDeletar) return; // Segurança
    
    try {
      await api.delete(`/listas/${listaParaDeletar.id}`);
      setListas(listasAtuais => 
        listasAtuais.filter(l => l.id !== listaParaDeletar.id)
      );
    } catch (error) {
      console.error("Erro ao deletar lista:", error);
      Alert.alert("Erro", "Não foi possível deletar a lista.");
    } finally {
      // Fecha o modal
      setDeleteModalVisible(false);
      setListaParaDeletar(null);
    }
  };

  // Esta função é chamada pela lixeira (só abre o modal)
  const handleAbrirModalDelecao = (lista: Lista) => {
    setListaParaDeletar(lista); // Guarda qual lista estamos deletando
    setDeleteModalVisible(true); // Abre o modal
  };

  // --- 5. RENDER ITEM ATUALIZADO (com useCallback) ---
  const renderItem = useCallback(({ item }: { item: Lista }) => (
    <View style={styles.listItem}>
      {/* Link para detalhes (igual) */}
      <Link 
        href={{ pathname: "../lista/[id]", params: { id: item.id } }} 
        asChild
      >
        <TouchableOpacity style={styles.listNomeContainer}>
          <Text style={styles.listNome}>{item.nome}</Text>
          <Text style={styles.listStatus}>{item.publica ? 'Pública' : 'Privada'}</Text>
        </TouchableOpacity>
      </Link>
      
      {/* Botão de Deletar (agora chama o modal) */}
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleAbrirModalDelecao(item)} // <-- 6. CHAMA O MODAL
      >
        <FontAwesome5 name="trash-alt" size={20} color={Colors.accentOrange} />
      </TouchableOpacity>
    </View>
  ), []); // useCallback sem dependências, pois a função de abrir o modal é estável

  // if (isLoading) (igual)
  if (isLoading && listas.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* O cabeçalho é definido pelo _layout.tsx (correto) */}
      
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

      {/* --- 7. O MODAL DE CONFIRMAÇÃO --- */}
      <Modal 
        isVisible={isDeleteModalVisible}
        onBackdropPress={() => setDeleteModalVisible(false)} // Fecha ao clicar fora
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Deletar Lista</Text>
          <Text style={styles.modalText}>
            Tem certeza que deseja deletar a lista "{listaParaDeletar?.nome}"?
          </Text>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalButtonCancel]}
              onPress={() => setDeleteModalVisible(false)}
            >
              <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalButtonDelete]}
              onPress={handleConfirmarDelecao}
            >
              <Text style={styles.modalButtonTextDelete}>Deletar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// --- 8. ESTILOS ATUALIZADOS (com estilos do modal) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  listItem: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  listNomeContainer: { flex: 1 },
  listNome: { fontSize: 18, color: Colors.text, fontWeight: '600', },
  listStatus: { fontSize: 14, color: Colors.grey },
  deleteButton: { paddingLeft: 15, paddingVertical: 5 },
  emptyText: { fontSize: 16, color: Colors.grey, textAlign: 'center', marginTop: 50 },

  // Estilos do Modal
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  modalButtonCancel: {
    backgroundColor: Colors.lightGrey,
  },
  modalButtonDelete: {
    backgroundColor: Colors.accentOrange,
  },
  modalButtonTextCancel: {
    color: Colors.text,
    fontWeight: '600',
  },
  modalButtonTextDelete: {
    color: Colors.white,
    fontWeight: '600',
  },
});