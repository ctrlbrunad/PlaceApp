import axios from 'axios';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text, TextInput,
  TouchableOpacity,
  View
} from 'react-native';
// --- 1. IMPORTAÇÕES ---
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
import { useAuth } from '../../src/context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter(); // Pega o router

  // --- 2. LÓGICA DE LOGIN ---
  const handleLogin = async () => {
    if (email === '' || senha === '') {
      Alert.alert('Erro', 'Email e senha são obrigatórios.');
      return;
    }
    setLoading(true);
    try {
      await login(email, senha);
      // O "Porteiro" (app/_layout.tsx) vai cuidar do redirecionamento
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error) && error.response) {
        Alert.alert('Erro no Login', error.response.data.message);
      } else {
        console.error(error);
        Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
      }
    }
    // Não precisa de setLoading(false) aqui, o app vai navegar
  };

  // --- 3. PARTE VISUAL (JSX) ---
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo!</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor={Colors.grey}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        placeholderTextColor={Colors.grey}
      />
      
      {/* Botão de Entrar */}
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>ENTRAR</Text>
        </TouchableOpacity>
      )}

      {/* Botão para ir ao Cadastro */}
      <TouchableOpacity 
        style={styles.linkButton} 
        onPress={() => router.push('/register')} // 'push' para poder voltar
      >
        <Text style={styles.linkText}>Não tem uma conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

// --- 4. ESTILOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.background, 
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
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
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