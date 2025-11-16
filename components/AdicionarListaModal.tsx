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

interface MinhaLista {
  id: string | number;
  nome: string;
}
type Props = {
  visible: boolean;
  onClose: () => void;
  estabelecimentoId: string | number; 
};

export default function AdicionarListaModal({ visible, onClose, estabelecimentoId }: Props) {
  const [listas, setListas] = useState<MinhaLista[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<string | number | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (visible) {
      fetchListas();
    }
  }, [visible]);

  const fetchListas = async () => {
    setIsLoading(true);
    try {
      // Rota GET /listas do seu backend
      const response = await api.get('/listas');
      setListas(response.data);
    } catch (error) {
      console.error("Erro ao buscar listas:", error);
      Alert.alert("Erro", "Não foi possível carregar suas listas.");
      onClose(); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleListPress = async (listaId: string | number) => {
    setIsSubmitting(listaId); 
    try {
      
      await api.post(`/listas/${listaId}/estabelecimentos`, {
        estabelecimentoId: estabelecimentoId,
      });
      
      Alert.alert("Sucesso!", "Local adicionado à sua lista.");
      onClose(); 

    } catch (error) {
      console.error("Erro ao adicionar a lista:", error);
      Alert.alert("Erro", "Não foi possível adicionar o local.");
    } finally {
      setIsSubmitting(null);
    }
  };

  const handleCriarLista = () => {
    onClose();
    router.push('/criarLista'); 
  };

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
            disabled={!!isSubmitting}
          >
            <FontAwesome name="list-ul" size={22} color={Colors.primary} />
            <Text style={styles.listText}>{lista.nome}</Text>
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

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent', 
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    maxHeight: '60%', 
    overflow: 'hidden',
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
    backgroundColor: Colors.text, 
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