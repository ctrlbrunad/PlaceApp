// app/(tabs)/home.tsx (VERSÃO COM TEXTO DA CATEGORIA CORRIGIDO)
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Colors from '../../constants/Colors';
import api from '../../src/services/api';

// Interfaces (iguais)
interface Estabelecimento { id: string; nome: string; categoria: string; subcategoria: string; endereco: string; media_notas: string; total_avaliacoes: number; }
interface Categoria { nome: string; iconName: React.ComponentProps<typeof FontAwesome5>['name']; }

// Categorias (iguais)
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
  const router = useRouter();

  // useEffect (lógica de 1 chamada, igual)
  useEffect(() => {
    const buscarDadosHome = async () => {
      setIsLoading(true); setError(null);
      try {
        const estabelecimentosResponse = await api.get<Estabelecimento[]>('/estabelecimentos');
        const todosEstabelecimentos = estabelecimentosResponse.data;
        const topGeral = [...todosEstabelecimentos]
          .sort((a, b) => parseFloat(b.media_notas) - parseFloat(a.media_notas))
          .slice(0, 3);
        if (topGeral.length === 3) {
          setTop3([ topGeral[1], topGeral[0], topGeral[2] ]);
        } else {
          setTop3(topGeral);
        }
      } catch (err) {
        console.error("Erro ao buscar dados da Home:", err);
        setError("Não foi possível carregar os dados. Verifique sua conexão ou tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };
    buscarDadosHome();
  }, []);

  // --- Funções de Navegação e Renderização (iguais) ---

  const handleCategoriaPress = (categoriaNome: string) => {
    router.push(`/estabelecimentos?categoria=${categoriaNome}`);
  };

  const renderCategoriaItem = ({ item }: { item: Categoria }) => (
    <TouchableOpacity 
      style={styles.categoriaItem}
      onPress={() => handleCategoriaPress(item.nome)}
    >
      <FontAwesome5
        name={item.iconName}
        size={32}
        color={Colors.text} // Marrom
        style={{ marginBottom: 8 }}
      />
      <Text style={styles.categoriaTexto}>{item.nome}</Text>
    </TouchableOpacity>
  );
  
  // Renderização Principal (igual)
  if (isLoading) { return ( <SafeAreaView style={styles.loadingContainer}><ActivityIndicator size="large" color={Colors.primary} /></SafeAreaView> ); }
  
  return ( 
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Cabeçalho, Logo, Busca (iguais) */}
        <View style={styles.header}><Text style={styles.cidade}>Cidade Exemplo</Text><Text style={styles.endereco}>Porto Velho, RO</Text></View>
        <View style={styles.logoContainer}>
           <Image source={require('../../assets/images/logo.png')} style={styles.logoImage} />
           <Text style={styles.logoText}>Place</Text>
        </View>
        <Text style={styles.slogan}>Descubra os melhores sabores da cidade</Text>
        <View style={styles.searchBarPlaceholder}></View>
        
        {error ? (<View style={styles.errorContainer}><Text style={styles.errorText}>{error}</Text></View>) : (
          <>
            {/* Categorias (igual) */}
            <Text style={styles.sectionTitle}>Categorias</Text>
            <FlatList 
              data={categorias} 
              renderItem={renderCategoriaItem} 
              keyExtractor={(item) => item.nome} 
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriasList}
              contentContainerStyle={{ paddingLeft: 10, paddingRight: 10 }}
              ListEmptyComponent={<Text style={styles.emptyText}>Categorias não encontradas.</Text>} 
            />

            {/* Top 3 (igual) */}
            <Text style={styles.sectionTitle}>Top 3 da Semana</Text>
            <View style={styles.top3Container}>
              {top3.map((item, index) => {
                const isPrimeiroLugar = index === 1; // O item do meio (1º lugar)
                
                return (
                  <View key={item.id} style={styles.top3ItemContainer}>
                    <View style={styles.top3ImagePlaceholder}></View>
                    <View style={[
                      styles.top3Bar,
                      isPrimeiroLugar ? styles.top3BarPrimeiro : styles.top3BarOutros
                    ]}>
                      <FontAwesome5 
                        name="award"
                        size={32}
                        color={isPrimeiroLugar ? Colors.text : Colors.primary}
                      />
                      <Text 
                        style={[
                          styles.top3Nome, 
                          { color: isPrimeiroLugar ? Colors.text : Colors.white }
                        ]}
                        numberOfLines={2}
                      >
                        {item.nome}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
            {top3.length === 0 && !isLoading && (
              <Text style={styles.emptyText}>Top 3 indisponível.</Text>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView> 
  );
}

// --- ESTILOS (AJUSTE NO BOTÃO E TEXTO DA CATEGORIA) ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.white },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 15, paddingBottom: 30 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  header: { marginTop: Platform.OS === 'android' ? 30 : 20, marginBottom: 15, alignItems: 'center' },
  cidade: { fontSize: 16, fontWeight: '600', color: Colors.text },
  endereco: { fontSize: 14, color: Colors.grey },
  logoContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 5 },
  logoImage: { width: 40, height: 40, resizeMode: 'contain', marginRight: 10 },
  logoText: { fontSize: 36, fontWeight: 'bold', color: Colors.primary },
  slogan: { fontSize: 16, color: Colors.text, textAlign: 'center', marginBottom: 25 },
  searchBarPlaceholder: { height: 45, backgroundColor: Colors.searchBar, borderRadius: 25, marginBottom: 25, borderWidth: 0 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginBottom: 15, marginLeft: 5 },
  categoriasList: { marginBottom: 30 },
  categoriaItem: { 
    backgroundColor: Colors.categoryBackground,
    paddingVertical: 15, 
    paddingHorizontal: 5, // <-- Diminui o padding lateral
    borderRadius: 15, 
    marginRight: 10, 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: 95,  // <-- Aumentei um pouco a largura
    height: 95, // <-- Aumentei um pouco a altura
  },
  categoriaTexto: { 
    fontSize: 11, // <-- Diminuí um pouco a fonte
    color: Colors.text,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center', // Garante centralização
  },
  top3Container: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 20, height: 240, gap: 15, paddingHorizontal: 10, justifyContent: 'center', },
  top3ItemContainer: { alignItems: 'center', width: '30%', maxWidth: 110, },
  top3ImagePlaceholder: { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.lightGrey, marginBottom: -30, zIndex: 2, borderWidth: 3, borderColor: Colors.background, },
  top3Bar: { borderRadius: 12, paddingTop: 40, paddingHorizontal: 10, paddingBottom: 10, alignItems: 'center', justifyContent: 'flex-start', width: '100%', ...Platform.select({ ios: { shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, }, android: { elevation: 3, }, }), },
  top3BarPrimeiro: { height: 160, backgroundColor: Colors.primary, },
  top3BarOutros: { height: 120, backgroundColor: Colors.text, },
  top3Nome: { fontSize: 14, fontWeight: '600', textAlign: 'center', marginTop: 8, },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center' },
  emptyText: { fontSize: 14, color: Colors.grey, textAlign: 'center', marginTop: 20, marginBottom: 20 },
});