// app/estabelecimento/[id].tsx (VERSÃO FINAL CORRIGIDA)
import { FontAwesome5 } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  AlertButton // <-- 1. Importa o tipo AlertButton
  ,




  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import api from '../../src/services/api';

// Interfaces
interface Estabelecimento { id: string; nome: string; categoria: string; subcategoria: string; endereco: string; media_notas: string; total_avaliacoes: number; }
interface ListaSimples { id: number; nome: string; }

export default function EstabelecimentoDetalheScreen() {
  const [estabelecimento, setEstabelecimento] = useState<Estabelecimento | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { id: estabelecimentoId } = useLocalSearchParams<{ id: string }>();

  // useEffect (Busca os dados - igual)
  useEffect(() => {
    if (!estabelecimentoId) return;
    const buscarDetalhes = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/estabelecimentos/${estabelecimentoId}`);
        setEstabelecimento(response.data);
      } catch (error) { console.error("Erro...", error); Alert.alert("Erro", "Não foi..."); }
      finally { setIsLoading(false); }
    };
    buscarDetalhes();
  }, [estabelecimentoId]);

  // Função chamada APÓS o usuário escolher a lista
  const handleSaveToList = async (listaId: number) => {
    try {
      await api.post(`/listas/${listaId}/estabelecimentos`, {
        estabelecimentoId: estabelecimentoId
      });
      Alert.alert("Sucesso!", `"${estabelecimento?.nome}" foi salvo na sua lista!`);
    } catch (error) {
       console.error("Erro ao salvar na lista:", error);
       Alert.alert("Erro", "Não foi possível salvar na lista.");
    } finally {
      // 2. CORRIGE O LOADING INFINITO
      setIsSaving(false); 
    }
  };
  
  const handleAvaliar = () => { Alert.alert("Avaliar (Em Breve)", "..."); };

  // Função chamada ao clicar em "Salvar"
  const handleSalvarPress = async () => {
    setIsSaving(true);
    try {
      const response = await api.get<ListaSimples[]>('/listas');
      const userLists = response.data;

      if (userLists.length === 0) {
        setIsSaving(false);
        Alert.alert( "Nenhuma lista...", "Crie uma 'Place'...", [
            { text: "Cancelar", style: "cancel" },
            { text: "Criar Lista", onPress: () => router.push('/criarLista') }
        ]);
        return;
      }

      // 3. CORRIGE O ERRO 'AlertButton'
      const alertButtons: AlertButton[] = userLists.map(list => ({
        text: list.nome,
        onPress: () => handleSaveToList(list.id)
      }));

      alertButtons.push({
        text: "Cancelar",
        style: "cancel",
        onPress: () => setIsSaving(false) // Para o spinner
      });

      Alert.alert("Salvar em...", "Escolha uma lista:", alertButtons);

    } catch (error) {
      console.error("Erro ao buscar listas:", error);
      Alert.alert("Erro", "Não foi possível buscar suas listas.");
      setIsSaving(false);
    }
  };

  // --- LÓGICA DE RENDERIZAÇÃO CORRIGIDA ---
  if (isLoading) {
    return ( 
      <SafeAreaView style={styles.loadingContainer}>
        <Stack.Screen options={{ title: 'Carregando...', headerTransparent: false, headerStyle: { backgroundColor: Colors.background } }} />
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView> 
    );
  }

  if (!estabelecimento) {
    return ( 
      <SafeAreaView style={styles.loadingContainer}>
        <Stack.Screen options={{ title: 'Erro', headerTransparent: false, headerStyle: { backgroundColor: Colors.background } }} /> 
        <Text style={styles.emptyText}>Local não encontrado.</Text>
      </SafeAreaView> 
    );
  }

  // Se 'estabelecimento' NÃO é null, renderiza:
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen 
        options={{ 
          title: estabelecimento.nome, // <-- Erro 'null' corrigido
          headerTransparent: true,
          headerTitle: '',
        }} 
      />
      <ScrollView>
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
            <TouchableOpacity style={styles.botaoAcao} onPress={handleAvaliar}>
              <Text style={styles.botaoAcaoTexto}>Avaliar</Text>
            </TouchableOpacity>
            {/* Botão SALVAR */}
            <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvarPress} disabled={isSaving}>
              {isSaving ? (
                <ActivityIndicator color={Colors.primary} />
              ) : (
                <FontAwesome5 name="bookmark" size={18} color={Colors.primary} solid />
              )}
            </TouchableOpacity>
          </View>
          
          {/* Informações */}
          <View style={styles.infoSection}>
            <FontAwesome5 name="map-marker-alt" size={20} color={Colors.text} style={styles.infoIcon} />
            <Text style={styles.infoTitulo}>Endereço:</Text>
            <Text style={styles.infoTexto}>{estabelecimento.endereco}</Text>
          </View>
          {/* ... (outras seções de informação iguais) ... */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos (iguais)
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  emptyText: { fontSize: 16, color: Colors.grey, textAlign: 'center', marginTop: 50 },
  imagemHeroPlaceholder: { height: 300, backgroundColor: Colors.lightGrey, },
  contentContainer: { padding: 20, },
  tituloRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15, },
  tituloInfo: { flex: 1, },
  subtitulo: { fontSize: 14, color: Colors.primary, fontWeight: '600', marginBottom: 4, },
  titulo: { fontSize: 24, fontWeight: 'bold', color: Colors.text, },
  nota: { fontSize: 36, fontWeight: 'bold', color: Colors.primary, marginLeft: 10, },
  botoesRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, },
  botaoAcao: { flex: 1, backgroundColor: Colors.primary, paddingVertical: 12, borderRadius: 20, alignItems: 'center', },
  botaoAcaoTexto: { color: Colors.white, fontSize: 16, fontWeight: 'bold', },
  botaoSalvar: { padding: 10, marginLeft: 15, },
  infoSection: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 15, },
  infoIcon: { marginRight: 15, marginTop: 2, width: 20, },
  infoTitulo: { fontSize: 16, fontWeight: 'bold', color: Colors.text, flex: 1, },
  infoTexto: { fontSize: 16, color: Colors.text, flex: 2, },
});