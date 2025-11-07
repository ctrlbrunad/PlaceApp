import React, { useState } from 'react';
import {
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
// import { AirbnbRating } from 'react-native-ratings'; // <-- REMOVIDO
import Colors from '../constants/Colors';

// Props continuam as mesmas
type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (nota: number, comentario: string) => void;
  isLoading: boolean;
};

export default function AvaliacaoModal({ visible, onClose, onSubmit, isLoading }: Props) {
  // 1. Alterado o estado inicial da nota para 0 (ou null)
  // para que nenhum número comece selecionado.
  const [nota, setNota] = useState<number | null>(null); 
  const [comentario, setComentario] = useState('');

  const handleSubmit = () => {
    // 2. Adicionado um check para garantir que uma nota foi selecionada
    if (!nota) {
      alert('Por favor, selecione uma nota de 1 a 5.');
      return;
    }
    if (!isLoading) {
      onSubmit(nota, comentario);
    }
  };

  // Helper para resetar o estado quando o modal é fechado
  const handleClose = () => {
    setNota(null);
    setComentario('');
    onClose();
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={handleClose}>
      
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Qual sua avaliação?</Text>

        {/* --- 3. SELETOR DE NÚMEROS (Substituiu o AirbnbRating) --- */}
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((numero) => (
            <TouchableOpacity
              key={numero}
              // Aplica o estilo 'selecionado' se a nota for igual ao número
              style={[
                styles.ratingButton,
                nota === numero && styles.ratingButtonSelected
              ]}
              // Atualiza o estado 'nota' ao ser pressionado
              onPress={() => setNota(numero)} 
            >
              <Text
                style={[
                  styles.ratingText,
                  nota === numero && styles.ratingTextSelected
                ]}
              >
                {numero}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* -------------------------------------------------------- */}

        <TextInput
          style={styles.textInput}
          placeholder="Escreva um comentário (opcional)"
          placeholderTextColor={Colors.grey}
          multiline
          numberOfLines={4}
          value={comentario}
          onChangeText={setComentario}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleClose}>
            <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
            disabled={isLoading || !nota}>
            <Text style={styles.buttonText}>
              {isLoading ? 'Enviando...' : 'Enviar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1, shadowRadius: 3 },
      android: { elevation: 20 },
    }),
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  
  // --- 4. NOVOS ESTILOS (para os botões de número) ---
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  ratingButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.lightGrey,
  },
  ratingButtonSelected: {
    backgroundColor: Colors.primary, // Laranja
    borderColor: Colors.primary,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text, // Marrom
  },
  ratingTextSelected: {
    color: Colors.white, // Branco
  },
  // ----------------------------------------------------

  textInput: {
    height: 100,
    backgroundColor: Colors.lightGrey,
    borderColor: Colors.grey,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 20,
    fontSize: 16,
    color: Colors.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: Colors.lightGrey,
  },
  cancelButtonText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: Colors.primary,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});