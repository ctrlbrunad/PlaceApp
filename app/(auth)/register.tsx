// app/(auth)/register.tsx (VERSÃO COMPLETA DO FORMULÁRIO)
import axios from 'axios';
import { useRouter } from 'expo-router'; // 2. Importa o router
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform, ScrollView,
  StyleSheet,
  Text, TextInput,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import api from '../../src/services/api'; // 1. Importa a API

export default function RegisterScreen() {
  const [nome, setNome] = useState(''); // 3. Adiciona o estado 'nome'
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Para navegar

  // 4. Lógica para o botão "Cadastrar"
  const handleRegister = async () => {
    // Validação
    if (nome.trim() === '' || email.trim() === '' || senha.trim() === '') {
      Alert.alert('Erro', 'Nome, email e senha são obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      // 5. Chama a API de registro do backend
      // (Exatamente a rota que testamos no Postman)
      await api.post('/auth/register', {
        nome,
        email,
        senha,
      });

      // 6. Sucesso!
      setLoading(false);
      Alert.alert(
        'Sucesso!',
        'Sua conta foi criada. Faça o login para continuar.'
      );
      // Manda o usuário de volta para a tela de login
      router.replace('/login');

    } catch (error) {
      // 7. Erro!
      setLoading(false);
      if (axios.isAxiosError(error) && error.response) {
        // Mostra o erro do backend (ex: "Este email já está em uso.")
        Alert.alert('Erro no Cadastro', error.response.data.message);
      } else {
        console.error(error);
        Alert.alert('Erro', 'Não foi possível se cadastrar.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Crie sua conta</Text>
        
        {/* --- CAMPO NOME --- */}
        <TextInput
          style={styles.input}
          placeholder="Nome Completo"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
          placeholderTextColor={Colors.grey}
        />
        
        {/* --- CAMPO EMAIL --- */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor={Colors.grey}
        />
        
        {/* --- CAMPO SENHA --- */}
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholderTextColor={Colors.grey}
        />
        
        {/* --- BOTÃO CADASTRAR --- */}
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>CADASTRAR</Text>
          </TouchableOpacity>
        )}

        {/* --- BOTÃO VOLTAR PARA LOGIN --- */}
        <TouchableOpacity style={styles.linkButton} onPress={() => router.replace('/login')}>
          <Text style={styles.linkText}>Já tem uma conta? Faça login</Text>
        </TouchableOpacity>
        
      </ScrollView>
    </SafeAreaView>
  );
}

// 8. Estilos (copiados do login.tsx e ajustados)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: Colors.text,
  },
  input: {
    height: 55,
    backgroundColor: Colors.white,
    borderColor: Colors.lightGrey,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10, // Espaço acima do botão
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
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
});