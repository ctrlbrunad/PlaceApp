import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Switch,
  Text, TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Colors from '../constants/Colors';
import api from '../src/services/api';

export default function CriarListaScreen() {
  const [nome, setNome] = useState('');
  const [isPublica, setIsPublica] = useState(false); // Checkbox para "Pública"
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSalvar = async () => {
    if (nome.trim() === '') {
      Alert.alert('Erro', 'O nome da lista é obrigatório.');
      return;
    }

    setIsLoading(true);
    try {
      // Chama a API que JÁ TESTAMOS! (POST /listas)
      await api.post('/listas', {
        nome: nome,
        publica: isPublica,
        estabelecimentos: [] // Começa vazia
      });

      setIsLoading(false);
      
      // Fecha o modal e volta para a tela anterior
      router.back();

    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error) && error.response) {
        Alert.alert('Erro ao Salvar', error.response.data.message);
      } else {
        console.error(error);
        Alert.alert('Erro', 'Não foi possível criar a lista.');
      }
    }
  };

  return (
    // Usamos View normal, pois o modal já cuida da SafeArea
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Nome da Lista</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Favoritos, Lugares para Ir"
          value={nome}
          onChangeText={setNome}
          placeholderTextColor={Colors.grey}
        />

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Deixar a lista pública?</Text>
          <Switch
            trackColor={{ false: Colors.grey, true: Colors.primary }}
            thumbColor={Colors.white}
            onValueChange={setIsPublica}
            value={isPublica}
          />
        </View>
        
        <Text style={styles.switchLabel}>
          {isPublica 
            ? "Outras pessoas poderão ver sua lista." 
            : "Apenas você poderá ver sua lista."}
        </Text>

        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={styles.button} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSalvar}>
            <Text style={styles.buttonText}>Criar Lista</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    height: 55,
    backgroundColor: Colors.white,
    borderColor: Colors.lightGrey,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 25,
    fontSize: 16,
    color: Colors.text,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  switchLabel: {
    fontSize: 13,
    color: Colors.grey,
    marginBottom: 30,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, },
      android: { elevation: 4, },
    }),
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});