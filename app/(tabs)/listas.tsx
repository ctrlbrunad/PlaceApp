// app/(tabs)/listas.tsx (VERSÃO FUNCIONAL)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import api from '../../src/services/api'; // Importa nossa API configurada
import Colors from '../../constants/Colors'; // Importa nossas cores
import { useAuth } from '../../src/context/AuthContext'; // Para pegar o token

// Define como é o objeto de uma lista (baseado na resposta do seu backend)
interface Lista {
  id: number; // No seu banco é SERIAL
  nome: string;
  publica: boolean;
  // estabelecimentos: string[]; // O GET /listas retorna um array de IDs
}

export default function ListasScreen() {
  const [listas, setListas] = useState<Lista[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth(); // Pega o token do usuário logado

  // Efeito que busca as listas QUANDO a tela monta
  useEffect(() => {
    const buscarListas = async () => {
      // Verifica se temos um token (se não, não faz sentido buscar)
      if (!token) {
        setIsLoading(false);
        // Poderia redirecionar para o login aqui, mas o "Porteiro" já faz isso.
        return;
      }

      setIsLoading(true);
      try {
        // --- A CHAMADA DE API ---
        // Faz o GET /listas. O token já está no header graças ao AuthContext
        const response = await api.get('/listas');
        setListas(response.data); // Guarda as listas recebidas
      } catch (error) {
        console.error("Erro ao buscar listas:", error);
        Alert.alert("Erro", "Não foi possível carregar suas listas.");
      } finally {
        setIsLoading(false); // Termina de carregar (com sucesso ou erro)
      }
    };

    buscarListas();
  }, [token]); // Re-executa se o token mudar (ex: login/logout)

  // Função para renderizar cada item da lista
  const renderItem = ({ item }: { item: Lista }) => (
    <View style={styles.listItem}>
      <Text style={styles.listNome}>{item.nome}</Text>
      <Text style={styles.listStatus}>{item.publica ? 'Pública' : 'Privada'}</Text>
      {/* TODO: Mostrar quantos locais tem na lista */}
    </View>
  );

  // Se ainda estiver carregando, mostra o spinner
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Se terminou de carregar, mostra a lista (ou mensagem de vazia)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Listas</Text>
      {listas.length === 0 ? (
        <Text style={styles.emptyText}>Você ainda não criou nenhuma lista.</Text>
      ) : (
        <FlatList
          data={listas}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()} // Usa o ID da lista como chave
        />
      )}
      {/* TODO: Adicionar botão '+' para criar nova lista */}
    </View>
  );
}

// Estilos básicos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  listItem: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    flexDirection: 'row', // Para colocar nome e status lado a lado
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listNome: {
    fontSize: 18,
    color: Colors.text,
  },
  listStatus: {
    fontSize: 14,
    color: Colors.grey,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.grey,
    textAlign: 'center',
    marginTop: 50,
  },
});