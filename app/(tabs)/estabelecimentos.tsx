// app/(tabs)/estabelecimentos.tsx (VERSÃO INTELIGENTE)
import { Stack, useLocalSearchParams } from 'expo-router'; // Importa hooks
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import api from '../../src/services/api';

// Define a interface do Estabelecimento
interface Estabelecimento {
  id: string;
  nome: string;
  media_notas: string;
  total_avaliacoes: number;
  subcategoria: string;
}

export default function EstabelecimentosScreen() {
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- 1. LÊ O PARÂMETRO DA URL ---
  // Pega o '?categoria=Hamburgueria' que a HomeScreen enviou
  const { categoria } = useLocalSearchParams<{ categoria: string }>();
  
  // Define o título da tela
  const tituloDaTela = categoria || "Estabelecimentos";

  // Efeito que busca os dados (agora é inteligente)
  useEffect(() => {
    const buscarEstabelecimentos = async () => {
      setIsLoading(true);
      
      // --- 2. ESCOLHE A ROTA CORRETA ---
      let endpoint = '';
      if (categoria) {
        // Cenário 2: Veio da Home (ex: Hamburgueria)
        // (Nota: Sua rota do backend espera o NOME da subcategoria, o que é perfeito)
        endpoint = `/estabelecimentos/top10/${categoria}`;
      } else {
        // Cenário 1: Clicou direto na aba "Estabelecimentos"
        endpoint = '/estabelecimentos'; 
      }

      try {
        const response = await api.get<Estabelecimento[]>(endpoint);
        setEstabelecimentos(response.data);
      } catch (error) {
        console.error(`Erro ao buscar estabelecimentos (${endpoint}):`, error);
        Alert.alert("Erro", "Não foi possível carregar os estabelecimentos.");
      } finally {
        setIsLoading(false);
      }
    };

    buscarEstabelecimentos();
  }, [categoria]); // Re-executa se o parâmetro 'categoria' mudar (ex: se voltar pra home e clicar em "Pizzaria")

  // --- 3. RENDERIZA O ITEM DA LISTA (Como no protótipo) ---
  const renderItem = ({ item }: { item: Estabelecimento }) => (
    <TouchableOpacity style={styles.itemContainer}>
      {/* Placeholder para a Imagem */}
      <View style={styles.itemImagePlaceholder} />
      
      <View style={styles.itemInfo}>
        <Text style={styles.itemNome}>{item.nome}</Text>
        <Text style={styles.itemDetalhes}>
          {item.media_notas} ★ ({item.total_avaliacoes}) - {item.subcategoria}
        </Text>
        {/* TODO: Adicionar tags (Barato, Delivery, etc.) */}
      </View>
      
      {/* Placeholder para o ícone de Salvar */}
      <View style={styles.itemSalvarPlaceholder} />
    </TouchableOpacity>
  );

  // --- Renderização Principal ---
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 4. Adiciona um Cabeçalho dinâmico */}
      <Stack.Screen options={{ 
        headerShown: true,
        title: tituloDaTela.toUpperCase(), // Título (ex: HAMBURGUERIA ou ESTABELECIMENTOS)
        headerStyle: { backgroundColor: Colors.background },
        headerTitleStyle: { color: Colors.text, fontWeight: 'bold' },
        headerShadowVisible: false,
        headerTintColor: Colors.text, // Cor da seta "voltar" (se houver)
      }} />

      <FlatList
        data={estabelecimentos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.container}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {categoria 
                ? `Nenhum estabelecimento encontrado para "${categoria}".`
                : "Nenhum estabelecimento encontrado."
              }
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// --- 5. ESTILOS PARA A LISTA (baseado no protótipo) ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  emptyContainer: {
    flex: 1,
    padding: 20,
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.grey,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    ...Platform.select({ // Sombra
      ios: { shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, },
      android: { elevation: 2, },
    }),
  },
  itemImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.lightGrey,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
  },
  itemNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  itemDetalhes: {
    fontSize: 13,
    color: Colors.grey,
  },
  itemSalvarPlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    opacity: 0.2, // Deixa o "salvar" mais fraco por enquanto
  },
});