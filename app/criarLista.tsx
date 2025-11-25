import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';
import api from '../src/services/api';

export default function CriarListaScreen() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState(''); // 1. Novo Estado
  const [isPublica, setIsPublica] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSalvar = async () => {
    if (nome.trim() === '') {
      Alert.alert('Erro', 'O nome da lista é obrigatório.');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/listas', {
        nome: nome,
        descricao: descricao, // 2. Envia a descrição
        publica: isPublica,
        estabelecimentos: [] 
      });

      setIsLoading(false);
      router.back();

    } catch (error) {
      setIsLoading(false);
      console.error(error);
      Alert.alert('Erro', 'Não foi possível criar a lista.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Criar Nova Lista',
          headerStyle: { backgroundColor: Colors.background },
          headerTitleStyle: { color: Colors.text },
          headerTintColor: Colors.text,
        }} 
      />
      
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Nome da Lista</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Favoritos, Lugares para Ir"
          value={nome}
          onChangeText={setNome}
          placeholderTextColor={Colors.grey}
        />

        {/* 3. Novo Campo de Descrição */}
        <Text style={styles.label}>Descrição (Opcional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]} // Estilo extra para área de texto
          placeholder="Ex: Minha seleção dos melhores cafés para trabalhar..."
          value={descricao}
          onChangeText={setDescricao}
          placeholderTextColor={Colors.grey}
          multiline={true}
          numberOfLines={3}
          textAlignVertical="top" // Importante para Android
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
      </ScrollView>
    </SafeAreaView>
  );
}

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
  // 4. Estilo para a área de texto
  textArea: {
    height: 100,
    paddingTop: 15,
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