import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

import Colors from '../constants/Colors';
import api from '../src/services/api';

// Define o formato de uma lista vinda da API
interface MinhaLista {
  id: string | number;
  nome: string;
}

// Define as propriedades que o Modal vai receber
type Props = {
  visible: boolean;
  onClose: () => void;
  estabelecimentoId: string | number; // ID do local que queremos adicionar
};

export default function AdicionarListaModal({ visible, onClose, estabelecimentoId }: Props) {
  const [listas, setListas] = useState<MinhaLista[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<string | number | null>(null); // Salva o ID da lista que está sendo enviada
  const router = useRouter();

  // Efeito que busca as listas do usuário QUANDO o modal se torna visível
  useEffect(() => {
    if (visible) {
      fetchListas();
    }
  }, [visible]);

  // Função para buscar as listas da API
  const fetchListas = async () => {
    setIsLoading(true);
    try {
      // Rota GET /listas do seu backend
      const response = await api.get('/listas');
      setListas(response.data);
    } catch (error) {
      console.error("Erro ao buscar listas:", error);
      Alert.alert("Erro", "Não foi possível carregar suas listas.");
      onClose(); // Fecha o modal se der erro
    } finally {
      setIsLoading(false);
    }
  };

  // Função chamada quando o usuário clica em uma lista
  const handleListPress = async (listaId: string | number) => {
    setIsSubmitting(listaId); // Mostra loading naquela linha específica
    try {
      // Rota POST /listas/:listaId/estabelecimentos do seu backend
      await api.post(`/listas/${listaId}/estabelecimentos`, {
        estabelecimentoId: estabelecimentoId,
      });
      
      Alert.alert("Sucesso!", "Local adicionado à sua lista.");
      onClose(); // Fecha o modal

    } catch (error) {
      console.error("Erro ao adicionar a lista:", error);
      Alert.alert("Erro", "Não foi possível adicionar o local.");
    } finally {
      setIsSubmitting(null);
    }
  };

  // Função para navegar para a tela de "Criar Lista"
  // (Isso já adianta seu "Item 2")
  const handleCriarLista = () => {
    onClose();
    router.push('/criarLista'); // <-- MUDANÇA AQUI
  };

  // Renderiza o conteúdo do modal
  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color={Colors.primary} style={{ marginVertical: 40 }} />;
    }

    if (listas.length === 0) {
      return (
        <Text style={styles.emptyText}>
          Você ainda não tem nenhuma lista. Crie uma!
        </Text>
      );
    }

    return (
      <ScrollView>
        {listas.map((lista) => (
          <TouchableOpacity 
            key={lista.id} 
            style={styles.listItem}
            onPress={() => handleListPress(lista.id)}
            disabled={!!isSubmitting} // Desativa todos os botões enquanto um é enviado
          >
            <FontAwesome name="list-ul" size={22} color={Colors.primary} />
            <Text style={styles.listText}>{lista.nome}</Text>
            {/* Mostra um loading no item que está sendo enviado */}
            {isSubmitting === lista.id && <ActivityIndicator size="small" color={Colors.primary} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Adicionar à Lista</Text>
          
          {/* Conteúdo dinâmico (loading ou listas) */}
          {renderContent()}

          {/* Botão Fixo "Criar Nova Lista" */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={handleCriarLista}
            >
              <Ionicons name="add" size={20} color={Colors.white} />
              <Text style={styles.createButtonText}>Criar Nova Lista</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent', // <-- MUDANÇA AQUI
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    maxHeight: '60%', // Limita a altura do modal
    overflow: 'hidden', // Garante que o footer fique preso
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 5 },
    }),
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  emptyText: {
    textAlign: 'center',
    padding: 30,
    fontSize: 16,
    color: Colors.grey,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  listText: {
    flex: 1,
    fontSize: 18,
    color: Colors.text,
    marginLeft: 15,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
    padding: 15,
  },
  createButton: {
    backgroundColor: Colors.text, // Marrom
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 25,
  },
  createButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});