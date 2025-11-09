import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import Colors from '../../constants/Colors';
import api from '../../src/services/api';

// Interface
interface Estabelecimento {
  id: string;
  nome: string;
  images?: string[];
  media_notas: string; 
}

interface Categoria {
  key: string;
  nome: string;
  icon: React.ComponentProps<typeof FontAwesome5>['name'];
  pack: 'FontAwesome5'; 
}

// Categorias (corretas)
const categorias: Categoria[] = [
  { key: 'hamburgueria', nome: 'Hamburgueria', icon: 'hamburger', pack: 'FontAwesome5' },
  { key: 'pizzaria', nome: 'Pizzaria', icon: 'pizza-slice', pack: 'FontAwesome5' },
  { key: 'cafeteria', nome: 'Cafeteria', icon: 'coffee', pack: 'FontAwesome5' },
  { key: 'restaurante', nome: 'Restaurante', icon: 'utensils', pack: 'FontAwesome5' },
];

export default function HomeScreen() {
  const [top3, setTop3] = useState<Estabelecimento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchTop3 = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/estabelecimentos');
        const todosEstabelecimentos = response.data;
        const topGeral = [...todosEstabelecimentos]
          .sort((a, b) => parseFloat(b.media_notas) - parseFloat(a.media_notas))
          .slice(0, 3);
        
        if (topGeral.length === 3) {
          setTop3([ topGeral[1], topGeral[0], topGeral[2] ]);
        } else {
          setTop3(topGeral);
        }
      } catch (error) {
        console.error("Erro ao buscar Top 3:", error);
        Alert.alert("Erro", "Não foi possível carregar o Top 3."); 
      } finally {
        setIsLoading(false);
      }
    };
    fetchTop3();
  }, []);
  
  const handleSearchSubmit = () => {
    if (searchText.trim() === '') {
      return; 
    }
    router.push(`/estabelecimentos?search=${searchText}`);
    setSearchText(''); 
  };

  // Renderiza o Top 3 (com pódio e medalha)
  const renderTop3Item = ({ item, index }: { item: Estabelecimento; index: number }) => {
    
    const isPrimeiroLugar = index === 1; 
    const cardStyle = isPrimeiroLugar ? styles.top3BarPrimeiro : styles.top3BarOutros;
    const textStyle = isPrimeiroLugar ? styles.top3NomePrimeiro : styles.top3NomeOutros;
    const iconColor = isPrimeiroLugar ? Colors.text : Colors.primary;
    
    const imageUrl = (item.images && item.images.length > 0)
      ? item.images[0]
      : 'https://placeholder.com/100x100.png?text=Sem+Foto';

    return (
      // --- CORREÇÃO AQUI ---
      // Adicionamos a 'key' única ao item de nível superior da lista
      <Link href={`/estabelecimento/${item.id}`} asChild key={item.id}>
        <TouchableOpacity style={cardStyle}>
          <View style={styles.top3Circle}>
            <Image source={{ uri: imageUrl }} style={styles.top3Image} />
          </View>
          <FontAwesome5
            name="award" 
            size={24}
            color={iconColor}
            style={{ marginTop: 10 }}
          />
          <Text style={textStyle} numberOfLines={2}>{item.nome}</Text>
        </TouchableOpacity>
      </Link>
    );
  };

  // Renderiza Categorias
  const renderCategoriaItem = ({ item }: { item: Categoria }) => (
    <TouchableOpacity 
      style={styles.categoriaItem}
      onPress={() => router.push(`/estabelecimentos?categoria=${item.nome}`)}
    >
      <FontAwesome5
        name={item.icon}
        size={32}
        color={Colors.text}
        style={{ marginBottom: 8 }}
      />
      <Text style={styles.categoriaTexto}>{item.nome}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLocation}>Cidade Exemplo</Text>
            <Text style={styles.headerCity}>Porto Velho, RO</Text>
          </View>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleLogo}>Place</Text>
        </View>
        <Text style={styles.slogan}>Descubra os melhores sabores da cidade</Text>
        
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.grey} />
          <TextInput 
            placeholder="Buscar..." 
            style={styles.searchInput}
            placeholderTextColor={Colors.grey}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
        </View>
        
        <Text style={styles.sectionTitle}>Categorias</Text>
        <FlatList 
          data={categorias} 
          renderItem={renderCategoriaItem} 
          keyExtractor={(item) => item.key} 
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriasList}
        />

        <Text style={styles.sectionTitle}>Top 3 da Semana</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ height: 200 }} />
        ) : (
          <View style={styles.top3List}>
            {top3.map((item, index) => renderTop3Item({ item, index }))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView> 
  );
}

// --- ESTILOS (Os mesmos da versão "Pódio Estático") ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 30 }, 
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  header: {
    alignItems: 'flex-start', 
  },
  headerLocation: {
    fontSize: 14,
    color: Colors.grey,
  },
  headerCity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  titleLogo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  slogan: { 
    fontSize: 14, 
    color: Colors.text, 
    textAlign: 'center', 
    marginBottom: 20 
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white, 
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginVertical: 20,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, },
      android: { elevation: 2, },
    }),
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: Colors.text,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: Colors.text, 
    marginBottom: 15,
  },
  categoriasList: { 
    marginBottom: 30 
  },
  categoriaItem: { 
    backgroundColor: Colors.categoryBackground,
    paddingVertical: 15, 
    paddingHorizontal: 5, 
    borderRadius: 15, 
    marginRight: 10, 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: 100,
    height: 100,
  },
  categoriaTexto: { 
    fontSize: 12, 
    color: Colors.text,
    fontWeight: '500',
    marginTop: 5,
    textAlign: 'center', 
  },
  
  top3List: { 
    height: 200,                
    flexDirection: 'row',       
    justifyContent: 'center', 
    alignItems: 'flex-end',     
  },
  top3BarPrimeiro: { 
    height: 180, 
    width: 110,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center', 
    padding: 10,
    marginHorizontal: 8,
    ...Platform.select({ ios: { shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, }, android: { elevation: 3, }, }),
  },
  top3BarOutros: { 
    height: 160, 
    width: 110,
    backgroundColor: Colors.text,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginHorizontal: 8,
    ...Platform.select({ ios: { shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, }, android: { elevation: 3, }, }),
  },
  top3Circle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.lightGrey,
    borderWidth: 3,
    borderColor: Colors.white,
    overflow: 'hidden',
    marginBottom: 10,
  },
  top3Image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  top3NomePrimeiro: { 
    fontSize: 14, 
    fontWeight: '600', 
    textAlign: 'center', 
    marginTop: 8,
    color: Colors.text, 
  },
  top3NomeOutros: { 
    fontSize: 14, 
    fontWeight: '600', 
    textAlign: 'center', 
    marginTop: 8,
    color: Colors.white, 
  },
  emptyText: { 
    fontSize: 14, 
    color: Colors.grey, 
    textAlign: 'center', 
    marginTop: 20, 
    marginBottom: 20 
  },
});