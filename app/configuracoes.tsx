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
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '../constants/Colors';
import { useAuth } from '../src/context/AuthContext';
import api from '../src/services/api';

export default function ConfiguracoesScreen() {
  const { user, updateUser } = useAuth(); 
  const router = useRouter();

  // Estados para o Nome
  const [nome, setNome] = useState(user?.nome || '');
  const [loadingNome, setLoadingNome] = useState(false);

  // --- 1. ADICIONAR ESTADOS PARA A SENHA ---
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loadingSenha, setLoadingSenha] = useState(false);

  // ... (handleSalvarNome - permanece o mesmo)
  const handleSalvarNome = async () => {
    if (nome.trim() === '' || nome.trim() === user?.nome) {
      Alert.alert('Atenção', 'Insira um nome diferente.');
      return;
    }
    setLoadingNome(true);
    try {
      const response = await api.put('/users/me', {
        nome: nome.trim(),
      });
      updateUser(response.data.usuario); 
      Alert.alert('Sucesso!', 'Seu nome foi alterado.');
    } catch (error) {
      console.error("Erro ao atualizar nome:", error);
      Alert.alert('Erro', 'Não foi possível salvar seu nome.');
    } finally {
      setLoadingNome(false);
    }
  };
  
  // --- 2. ADICIONAR FUNÇÃO PARA SALVAR SENHA ---
  const handleSalvarSenha = async () => {
    if (novaSenha.trim() === '' || confirmarSenha.trim() === '') {
      Alert.alert('Campos Vazios', 'Preencha a nova senha e a confirmação.');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      Alert.alert('Senhas Diferentes', 'A nova senha e a confirmação não são iguais.');
      return;
    }
    if (novaSenha.length < 6) {
      Alert.alert('Senha Curta', 'A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoadingSenha(true);
    try {
      await api.put('/users/me/senha', { novaSenha });

      Alert.alert('Sucesso!', 'Sua senha foi alterada.');
      setNovaSenha('');
      setConfirmarSenha('');

    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
      Alert.alert('Erro', 'Não foi possível atualizar sua senha.');
    } finally {
      setLoadingSenha(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Configurações',
          headerStyle: { backgroundColor: Colors.background },
          headerTitleStyle: { color: Colors.text },
          headerTintColor: Colors.text,
        }} 
      />
      
      <ScrollView contentContainerStyle={styles.form}>
        {/* --- Formulário p alterar nome --- */}
        <Text style={styles.label}>Alterar nome de exibição</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholderTextColor={Colors.grey}
        />
        <TouchableOpacity 
          style={styles.button}
          onPress={handleSalvarNome} 
          disabled={loadingNome}
        >
          {loadingNome ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.buttonText}>Salvar Nome</Text>
          )}
        </TouchableOpacity>
        
        {/* --- 3. ADICIONA FORMULÁRIO DE ALTERAR SENHA --- */}
        <View style={styles.divider} />

        <Text style={styles.label}>Alterar Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Nova Senha"
          value={novaSenha}
          onChangeText={setNovaSenha}
          placeholderTextColor={Colors.grey}
          secureTextEntry 
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Nova Senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          placeholderTextColor={Colors.grey}
          secureTextEntry 
        />
        <TouchableOpacity 
          style={styles.button}
          onPress={handleSalvarSenha} 
          disabled={loadingSenha}
        >
          {loadingSenha ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.buttonText}>Salvar Nova Senha</Text>
          )}
        </TouchableOpacity>
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

  divider: {
    height: 1,
    backgroundColor: Colors.lightGrey,
    marginVertical: 30,
  },
});