// app/(tabs)/home.tsx (VERSÃO FINAL COM LOGO CORRIGIDO)
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image // <-- 1. IMPORTAÇÃO DO 'Image' (você já fez)
  ,
















  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import api from '../../src/services/api';

// Interfaces (iguais)
interface Estabelecimento { id: string; nome: string; categoria: string; subcategoria: string; endereco: string; media_notas: string; total_avaliacoes: number; }
interface Categoria { nome: string; iconName: React.ComponentProps<typeof FontAwesome5>['name']; }

// Categorias (com Sorveteria)
const CATEGORIAS_MVP: Categoria[] = [
  { nome: 'Hamburgueria', iconName: 'hamburger' },
  { nome: 'Pizzaria',     iconName: 'pizza-slice' },
  { nome: 'Cafeteria',    iconName: 'coffee' },
  { nome: 'Restaurante',  iconName: 'utensils' }, 
  { nome: 'Sorveteria',   iconName: 'ice-cream' },
];

export default function HomeScreen() {
  const [categorias] = useState<Categoria[]>(CATEGORIAS_MVP);
  const [top3, setTop3] = useState<Estabelecimento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect (igual)
  useEffect(() => {
    const buscarDadosHome = async () => { /* ... (código igual) ... */ setIsLoading(true); setError(null); try { const top10Response = await api.get<Estabelecimento[]>('/estabelecimentos/top10/Hamburgueria'); setTop3(top10Response.data.slice(0, 3)); } catch (err) { console.error("Erro...", err); setError("Não foi possível..."); } finally { setIsLoading(false); } };
    buscarDadosHome();
  }, []);

  // Funções de Renderização (iguais)
  const renderCategoriaItem = ({ item }: { item: Categoria }) => (
    <TouchableOpacity style={styles.categoriaItem}>
      <FontAwesome5 name={item.iconName} size={32} color={Colors.text} style={{ marginBottom: 8 }} />
      <Text style={styles.categoriaTexto}>{item.nome}</Text>
    </TouchableOpacity>
  );

  const renderTop3Item = (indexVisual: number) => { /* ... (código igual) ... */ let styleIndex = 0; if (indexVisual === 0) styleIndex = 1; if (indexVisual === 2) styleIndex = 2; const itemCorreto = top3[styleIndex]; if (!itemCorreto) return null; let altura = 120; let corFundo = Colors.text; let corTexto = Colors.white; let corPosicao = Colors.primary; if (indexVisual === 1) { altura = 160; corFundo = Colors.primary; corTexto = Colors.white; corPosicao = Colors.white; } const posicaoReal = styleIndex + 1; return ( <View key={itemCorreto.id} style={[styles.top3Item, { height: altura, backgroundColor: corFundo }]}><Text style={[styles.top3Posicao, { color: corPosicao }]}>{posicaoReal}º</Text><Text style={[styles.top3Nome, { color: corTexto }]} numberOfLines={2}>{itemCorreto.nome}</Text></View> ); };

  // Renderização Principal
  if (isLoading) { return ( <SafeAreaView style={styles.loadingContainer}><ActivityIndicator size="large" color={Colors.primary} /></SafeAreaView> ); }
  return ( 
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.cidade}>Cidade Exemplo</Text>
          <Text style={styles.endereco}>Porto Velho, RO</Text>
        </View>
        
        {/* --- 2. LOGO CORRIGIDO (você já fez) --- */}
        <View style={styles.logoContainer}>
           <Image 
             source={require('../../assets/images/logo.png')} 
             style={styles.logoImage} // <-- O erro estava aqui
           />
           <Text style={styles.logoText}>Place</Text>
        </View>
        <Text style={styles.slogan}>Descubra os melhores sabores da cidade</Text>
        
        {/* Barra de Busca */}
        <View style={styles.searchBarPlaceholder}></View>
        
        {/* Renderização Condicional (igual) */}
        {error ? (<View style={styles.errorContainer}><Text style={styles.errorText}>{error}</Text></View>) : (<>{/* Categorias */}<Text style={styles.sectionTitle}>Categorias</Text><FlatList data={categorias} renderItem={renderCategoriaItem} keyExtractor={(item) => item.nome} horizontal showsHorizontalScrollIndicator={false} style={styles.categoriasList} contentContainerStyle={{ paddingLeft: 10, paddingRight: 10 }} ListEmptyComponent={<Text style={styles.emptyText}>Categorias não encontradas.</Text>} />{/* Top 3 */}<Text style={styles.sectionTitle}>Top 3 Hamburguerias</Text>{top3.length === 0 ? (<Text style={styles.emptyText}>Top 3 indisponível.</Text>) : (<View style={styles.top3Container}>{renderTop3Item(0)}{renderTop3Item(1)}{renderTop3Item(2)}</View>)}</>)}
      </ScrollView>
    </SafeAreaView> 
  );
}

// --- 3. ESTILOS ATUALIZADOS ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 15, paddingBottom: 30 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  header: { marginTop: Platform.OS === 'android' ? 30 : 20, marginBottom: 15, alignItems: 'center' },
  cidade: { fontSize: 16, fontWeight: '600', color: Colors.text },
  endereco: { fontSize: 14, color: Colors.grey },
  logoContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 5 },
  
  // --- CORREÇÃO AQUI: Substitui 'logoPlaceholder' por 'logoImage' ---
  logoImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
  },
  
  logoText: { fontSize: 36, fontWeight: 'bold', color: Colors.primary },
  slogan: { fontSize: 16, color: Colors.text, textAlign: 'center', marginBottom: 25 },
  searchBarPlaceholder: { 
    height: 45, 
    backgroundColor: Colors.searchBar,
    borderRadius: 25, 
    marginBottom: 25, 
    borderWidth: 0,
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginBottom: 15, marginLeft: 5 },
  categoriasList: { marginBottom: 30 },
  categoriaItem: { 
    backgroundColor: Colors.categoryBackground,
    paddingVertical: 15, 
    paddingHorizontal: 10, 
    borderRadius: 15, 
    marginRight: 10, 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: 83, 
    height: 83,
  },
  categoriaTexto: { 
    fontSize: 10, 
    color: Colors.text,
    fontWeight: 'bold',
    marginTop: 5 
  },
  // Estilos do Top 3 (iguais)
  top3Container: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 20, height: 180, gap: 15, paddingHorizontal: 10, justifyContent: 'center' },
  top3Item: { borderRadius: 12, padding: 10, alignItems: 'center', justifyContent: 'flex-start', width: '30%', maxWidth: 110, ...Platform.select({ ios: { shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, }, android: { elevation: 3, }, }) },
  top3Posicao: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  top3Nome: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
  // Estilos de Erro e Empty (iguais)
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center' },
  emptyText: { fontSize: 14, color: Colors.grey, textAlign: 'center', marginTop: 20, marginBottom: 20 },
});