import axios from 'axios';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert, // 1. Importe o TouchableOpacity
    Platform // Para a sombra
    ,

    StyleSheet,
    Text, TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Colors from '../../constants/Colors';
import { useAuth } from '../../src/context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    // A lógica de login (handleLogin) continua igual
    if (email === '' || senha === '') {
      Alert.alert('Erro', 'Email e senha são obrigatórios.');
      return;
    }
    setLoading(true);
    try {
      await login(email, senha);
      // O 'catch' também é o mesmo
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error) && error.response) {
        Alert.alert('Erro no Login', error.response.data.message);
      } else {
        console.error(error);
        Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
      }
    }
    // Não precisamos mais do setLoading(false) aqui, pois o "porteiro" vai redirecionar
  };

  return (
    // 3. APLIQUE AS CORES
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
      
      {/* 4. SUBSTITUA O <Button> POR UM BOTÃO CUSTOMIZADO */}
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>ENTRAR</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// 5. ATUALIZE OS ESTILOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.background, // Usa a cor de fundo do protótipo
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: Colors.text, // Usa a cor de texto do protótipo
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
    backgroundColor: Colors.primary, // Usa a cor primária
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    
    // Sombra (para dar um 'tchan')
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
});