import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Colors from '../constants/Colors';

type Props = {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
};

// A lista de itens (baseada no seu protótipo)
const menuItems = [
  { key: 'avaliacoes', title: 'Minhas Avaliações' },
  { key: 'favoritos', title: 'Meus Favoritos' },
  { key: 'visitados', title: 'Locais Visitados' },
  { key: 'conquistas', title: 'Conquistas' },
  { key: 'configuracoes', title: 'Configurações' },
];

export default function ProfileMenuModal({ visible, onClose, onLogout }: Props) {
  
  const handleMenuItemPress = (key: string) => {
    onClose(); 
    alert(`Opção "${key}" clicada. Navegação não implementada.`);
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
          
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={item.key} 
              style={[
                styles.menuButton, 
                index < menuItems.length - 1 && styles.separator
              ]}
              onPress={() => handleMenuItemPress(item.key)}
            >
              
              {/* --- CORREÇÃO AQUI --- */}
              {/* Renderiza o ícone específico para cada chave.
                  Isso remove o erro do TypeScript */}
              {item.key === 'avaliacoes' && <FontAwesome name="star" size={22} color={Colors.primary} />}
              {item.key === 'favoritos' && <FontAwesome name="heart" size={22} color={Colors.primary} />}
              {item.key === 'visitados' && <Ionicons name="location-sharp" size={22} color={Colors.primary} />}
              {item.key === 'conquistas' && <FontAwesome name="trophy" size={22} color={Colors.primary} />}
              {item.key === 'configuracoes' && <Ionicons name="settings-sharp" size={22} color={Colors.primary} />}
              {/* ------------------------- */}
              
              <Text style={styles.menuButtonText}>{item.title}</Text>
              <Feather name="chevron-right" size={22} color={Colors.grey} />
            </TouchableOpacity>
          ))}
          
          {/* --- Botão de Sair (Logout) --- */}
          <TouchableOpacity 
            style={[styles.menuButton, styles.logoutButton]}
            onPress={() => {
              onClose(); 
              onLogout(); 
            }}
          >
            <Ionicons name="log-out-outline" size={22} color={Colors.accentOrange} />
            <Text style={[styles.menuButtonText, styles.logoutText]}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// --- Estilos (Os mesmos de antes) ---
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: '100%',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 5 },
    }),
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
  },
  menuButtonText: {
    flex: 1, 
    fontSize: 16,
    color: Colors.text,
    marginLeft: 15,
    fontWeight: '500',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  logoutButton: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
  },
  logoutText: {
    color: Colors.accentOrange,
    fontWeight: 'bold',
  },
});