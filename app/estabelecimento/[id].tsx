// app/estabelecimento/[id].tsx (A "TELA AVALIA + SALVA")
import { FontAwesome5 } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert, ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import api from '../../src/services/api';

// Interface
interface Estabelecimento { 
  id: string; nome: string; categoria: string; subcategoria: string; 
  endereco: string; media_notas: string; total_avaliacoes: number;
  // TODO: Adicionar 'telefone' e 'horario' se o backend tiver
}

export default function EstabelecimentoDetalheScreen() {
  const [estabelecimento, setEstabelecimento] = useState<Estabelecimento | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // 1. Pega o [id] da URL (ex: /estabelecimento/estab10)
  const { id } = useLocalSearchParams<{ id: string }>();

  // 2. Busca os dados
  useEffect(() => {
    if (!id) return;

    const buscarDetalhes = async () => {
      setIsLoading(true);
      try {
        // Rota que já testamos e funciona!
        const response = await api.get(`/estabelecimentos/${id}`);
        setEstabelecimento(response.data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do estabelecimento:", error);
        Alert.alert("Erro", "Não foi possível carregar os detalhes deste local.");
      } finally {
        setIsLoading(false);
      }
    };
    buscarDetalhes();
  }, [id]);

  // --- 3. FUNÇÃO PARA O BOTÃO "SALVAR" (Feature 3) ---
  const handleSalvar = () => {
    // No futuro, isso vai abrir um modal para selecionar a lista
    // e chamar a API POST /listas/:listaId/estabelecimentos
    Alert.alert(
      "Salvar (Em Breve)", 
      `Aqui você salvará o "${estabelecimento?.nome}" em uma das suas listas.`
    );
  };
  
  const handleAvaliar = () => {
    Alert.alert("Avaliar (Em Breve)", "Aqui você irá para a tela de avaliação.");
  };

  // Se estiver carregando
  if (isLoading) {
    return ( <SafeAreaView style={styles.loadingContainer}><ActivityIndicator size="large" color={Colors.primary} /></SafeAreaView> );
  }

  // Se deu erro ou não encontrou
  if (!estabelecimento) {
    return ( <SafeAreaView style={styles.loadingContainer}><Text style={styles.emptyText}>Local não encontrado.</Text></SafeAreaView> );
  }

  // Se encontrou (Renderiza a tela baseada no protótipo)
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen 
        options={{ 
          title: estabelecimento.nome, // Título dinâmico
          // O 'headerTransparent' já foi setado no _layout.tsx
        }} 
      />

      <ScrollView>
        {/* Placeholder para a Imagem Grande */}
        <View style={styles.imagemHeroPlaceholder}></View>

        <View style={styles.contentContainer}>
          {/* Título e Nota */}
          <View style={styles.tituloRow}>
            <View style={styles.tituloInfo}>
              <Text style={styles.subtitulo}>{`1º em ${estabelecimento.subcategoria}`}</Text>
              <Text style={styles.titulo}>{estabelecimento.nome}</Text>
            </View>
            <Text style={styles.nota}>{parseFloat(estabelecimento.media_notas).toFixed(1)}</Text>
          </View>

          {/* Botões de Ação */}
          <View style={styles.botoesRow}>
            {/* TODO: Tags (Entrega rápida, Barato, etc.) */}
            <TouchableOpacity style={styles.botaoAcao} onPress={handleAvaliar}>
              <Text style={styles.botaoAcaoTexto}>Avaliar</Text>
            </TouchableOpacity>
            {/* Botão SALVAR */}
            <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar}>
              <FontAwesome5 name="bookmark" size={18} color={Colors.primary} solid />
            </TouchableOpacity>
          </View>
          
          {/* Informações */}
          <View style={styles.infoSection}>
            <FontAwesome5 name="map-marker-alt" size={20} color={Colors.text} style={styles.infoIcon} />
            <Text style={styles.infoTitulo}>Endereço:</Text>
            <Text style={styles.infoTexto}>{estabelecimento.endereco}</Text>
          </View>
          
          <View style={styles.infoSection}>
            <FontAwesome5 name="phone" size={20} color={Colors.text} style={styles.infoIcon} />
            <Text style={styles.infoTitulo}>Telefone:</Text>
            <Text style={styles.infoTexto}>(69) 99229-1062</Text>
          </View>
          
          <View style={styles.infoSection}>
            <FontAwesome5 name="clock" size={20} color={Colors.text} style={styles.infoIcon} />
            <Text style={styles.infoTitulo}>Horário de funcionamento:</Text>
            <Text style={styles.infoTexto}>Fechado - Abre às 18:00h</Text>
          </View>

          {/* TODO: Seção de "Reviews" (chamar GET /reviews/:id) */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos (baseados no protótipo) ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  emptyText: { fontSize: 16, color: Colors.grey, textAlign: 'center', marginTop: 50 },
  
  imagemHeroPlaceholder: {
    height: 300,
    backgroundColor: Colors.lightGrey,
  },
  contentContainer: {
    padding: 20,
  },
  tituloRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  tituloInfo: {
    flex: 1, // Para o texto quebrar a linha se for grande
  },
  subtitulo: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  nota: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primary,
    marginLeft: 10,
  },
  botoesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  botaoAcao: {
    flex: 1, // Ocupa a maior parte do espaço
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  botaoAcaoTexto: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoSalvar: {
    padding: 10,
    marginLeft: 15,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  infoIcon: {
    marginRight: 15,
    marginTop: 2,
    width: 20, // Largura fixa para alinhar o texto
  },
  infoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1, // Ocupa o espaço
  },
  infoTexto: {
    fontSize: 16,
    color: Colors.text,
    flex: 2, // Ocupa mais espaço
  },
});