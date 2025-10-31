// app/(tabs)/estabelecimentos.tsx (VERSÃO COM ITENS CLICÁVEIS)
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
// --- 1. IMPORTA O <Link> ---
import { Link, Stack, useLocalSearchParams } from 'expo-router';

// Interface (igual)
interface Estabelecimento { id: string; nome: string; media_notas: string; total_avaliacoes: number; subcategoria: string; }

export default function EstabelecimentosScreen() {
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { categoria } = useLocalSearchParams<{ categoria: string }>();
  const tituloDaTela = categoria || "Estabelecimentos";

  // useEffect (igual)
  useEffect(() => {
    const buscarEstabelecimentos = async () => { /* ... (código igual) ... */ setIsLoading(true); let endpoint = categoria ? `/estabelecimentos/top10/${categoria}` : '/estabelecimentos'; try { const response = await api.get<Estabelecimento[]>(endpoint); setEstabelecimentos(response.data); } catch (error) { console.error(`Erro...`, error); Alert.alert("Erro", "Não foi..."); } finally { setIsLoading(false); } };
    buscarEstabelecimentos();
  }, [categoria]);

  // --- 2. RENDERIZA O ITEM ATUALIZADO (com <Link>) ---
  const renderItem = ({ item }: { item: Estabelecimento }) => (
    // 'asChild' diz ao Link para usar o TouchableOpacity como botão
    <Link 
      href={{
        pathname: "/estabelecimento/[id]",
        params: { id: item.id }
      }} 
      asChild
    >
      <TouchableOpacity style={styles.itemContainer}>
        {/* Placeholder para a Imagem */}
        <View style={styles.itemImagePlaceholder} />
        
        <View style={styles.itemInfo}>
          <Text style={styles.itemNome}>{item.nome}</Text>
          <Text style={styles.itemDetalhes}>
            {item.media_notas} ★ ({item.total_avaliacoes}) - {item.subcategoria}
          </Text>
        </View>
        
        {/* Placeholder para o ícone de Salvar */}
        <View style={styles.itemSalvarPlaceholder} />
      </TouchableOpacity>
    </Link>
  );

  // Renderização Principal (igual)
  if (isLoading) { return ( <SafeAreaView style={styles.loadingContainer}><ActivityIndicator size="large" color={Colors.primary} /></SafeAreaView> ); }
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ 
        headerShown: true,
        headerTitle: tituloDaTela.toUpperCase(),
        headerStyle: { backgroundColor: Colors.background },
        headerTitleStyle: { color: Colors.text, fontWeight: 'bold' },
        headerShadowVisible: false, headerTintColor: Colors.text,
      }} />

      <FlatList
        data={estabelecimentos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.container}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {categoria ? `Nenhum estabelecimento encontrado para "${categoria}".` : "Nenhum estabelecimento encontrado."}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// Estilos (iguais)
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  emptyContainer: { flex: 1, padding: 20, marginTop: 50, alignItems: 'center' },
  emptyText: { fontSize: 16, color: Colors.grey, textAlign: 'center' },
  itemContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, padding: 15, marginHorizontal: 15, marginVertical: 8, borderRadius: 12, ...Platform.select({ ios: { shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, }, android: { elevation: 2, }, }), },
  itemImagePlaceholder: { width: 60, height: 60, borderRadius: 8, backgroundColor: Colors.lightGrey },
  itemInfo: { flex: 1, marginLeft: 15 },
  itemNome: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  itemDetalhes: { fontSize: 13, color: Colors.grey },
  itemSalvarPlaceholder: { width: 30, height: 30, borderRadius: 15, backgroundColor: Colors.primary, opacity: 0.2 },
});