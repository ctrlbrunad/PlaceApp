import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform, // 1. IMPORTAR 'Platform'
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Colors from '../constants/Colors';

// Props (igual)
type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (nota: number, comentario: string) => void;
  isLoading: boolean;
};

export default function AvaliacaoModal({ visible, onClose, onSubmit, isLoading }: Props) {
  const [nota, setNota] = useState<number | null>(null); 
  const [comentario, setComentario] = useState('');

  const handleSubmit = () => {
    if (!nota) {
      alert('Por favor, selecione uma nota de 1 a 5.');
      return;
    }
    if (!isLoading) {
      onSubmit(nota, comentario);
    }
  };

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
      
      {/* 3. Envolver TUDO com o KeyboardAvoidingView */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
      >
        {/* Fundo clicável para fechar */}
        <TouchableWithoutFeedback onPress={handleClose}>
          {/* O overlay agora é absoluto para cobrir o fundo */}
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        {/* O conteúdo do modal (não é mais 'absolute') */}
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Qual sua avaliação?</Text>

          {/* Seletor de Números (igual) */}
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((numero) => (
              <TouchableOpacity
                key={numero}
                style={[
                  styles.ratingButton,
                  nota === numero && styles.ratingButtonSelected
                ]}
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

          {/* Campo de Texto (igual) */}
          <TextInput
            style={styles.textInput}
            placeholder="Escreva um comentário (opcional)"
            placeholderTextColor={Colors.grey}
            multiline
            numberOfLines={4}
            value={comentario}
            onChangeText={setComentario}
          />

          {/* Botões (igual) */}
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
      </KeyboardAvoidingView>
    </Modal>
  );
}

// --- 4. ATUALIZAR OS ESTILOS ---
const styles = StyleSheet.create({
  // Este é o novo container principal
  keyboardAvoidingContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Empurra o 'modalContent' para baixo
  },
  modalOverlay: {
    // Cobre todo o fundo e é clicável
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    // Não é mais 'position: absolute'
    // O KeyboardAvoidingView vai gerenciá-lo
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
    backgroundColor: Colors.primary, 
    borderColor: Colors.primary,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text, 
  },
  ratingTextSelected: {
    color: Colors.white, 
  },
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