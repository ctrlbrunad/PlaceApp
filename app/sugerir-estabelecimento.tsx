import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '../constants/Colors';
import api from '../src/services/api';

export default function SugerirEstabelecimentoScreen() {
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [categoria, setCategoria] = useState(''); // O admin classifica depois
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSugerir = async () => {
    // 1. Validação
    if (nome.trim() === '' || endereco.trim() === '') {
      Alert.alert('Campos Obrigatórios', 'Por favor, preencha o nome e o endereço.');
      return;
    }

    setLoading(true);
    try {
      // 2. Chama a API do Backend
      // Rota POST /sugestoes (RF09) [cite: 155, 289]
      await api.post('/sugestoes', {
        nome: nome,
        endereco: endereco,
        // O TCC diz 'subcategoriaId'[cite: 261], mas para uma sugestão
        // é mais fácil o usuário digitar um texto.
        subcategoria: categoria, 
      });

      // 3. Sucesso
      Alert.alert('Obrigado!', 'Sua sugestão foi enviada para análise.');
      
      // 4. Volta para a tela anterior
      router.back(); 

    } catch (error) {
      console.error("Erro ao enviar sugestão:", error);
      Alert.alert('Erro', 'Não foi possível enviar sua sugestão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Configura o cabeçalho desta tela */}
      <Stack.Screen 
        options={{ 
          title: 'Sugerir Local',
          headerStyle: { backgroundColor: Colors.background },
          headerTitleStyle: { color: Colors.text },
          headerTintColor: Colors.text, // Cor da seta "voltar"
        }} 
      />
      
      {/* Usamos ScrollView para o teclado não cobrir os campos */}
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Nome do Estabelecimento</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Cantina da Maria"
          value={nome}
          onChangeText={setNome}
          placeholderTextColor={Colors.grey}
        />
        
        <Text style={styles.label}>Endereço</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Av. Sete de Setembro, 1234"
          value={endereco}
          onChangeText={setEndereco}
          placeholderTextColor={Colors.grey}
        />
        
        <Text style={styles.label}>Categoria (Opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Lanchonete, Pizzaria, Regional..."
          value={categoria}
          onChangeText={setCategoria}
          placeholderTextColor={Colors.grey}
        />

        {/* --- Botão Enviar --- */}
        <TouchableOpacity 
          style={styles.button}
          onPress={handleSugerir} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.buttonText}>Enviar Sugestão</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos (baseados no seu 'criarLista.tsx') ---
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
    fontWeight: 'bold',
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
    marginBottom: 20,
    fontSize: 16,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
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