import { FontAwesome5 } from '@expo/vector-icons'; // Usaremos a medalha 'award'
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '../constants/Colors';
import api from '../src/services/api';

// Interface para os dados que esperamos
interface UserStats {
  reviewsCount: number;
  listsCount: number;
}

// Define as "regras" da gamificação
const conquistas = {
  reviews: [
    { nome: 'Avaliador Iniciante', meta: 1 },
    { nome: 'Crítico Júnior', meta: 5 },
    { nome: 'Crítico Pleno', meta: 10 },
    { nome: 'Especialista Local', meta: 20 },
  ],
  lists: [
    { nome: 'Colecionador', meta: 1 },
    { nome: 'Organizador', meta: 3 },
    { nome: 'Curador', meta: 5 },
  ],
};

export default function ConquistasScreen() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Busca os dados da rota /users/me (que já usamos no Perfil)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        // Rota de stats
        const response = await api.get('/users/me'); 
        setStats({
          reviewsCount: response.data.reviewsCount || 0,
          listsCount: response.data.listsCount || 0,
        });
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
        Alert.alert("Erro", "Não foi possível carregar suas conquistas.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Componente para renderizar uma única "badge"
  const Badge = ({ nome, meta, count }: { nome: string, meta: number, count: number }) => {
    const isUnlocked = count >= meta;
    
    return (
      <View style={[styles.badgeContainer, isUnlocked ? styles.badgeUnlocked : styles.badgeLocked]}>
        <FontAwesome5 
          name="award" 
          size={40} 
          color={isUnlocked ? Colors.primary : Colors.grey} 
        />
        <View style={styles.badgeInfo}>
          <Text style={[styles.badgeNome, !isUnlocked && styles.badgeTextLocked]}>
            {nome}
          </Text>
          <Text style={[styles.badgeMeta, !isUnlocked && styles.badgeTextLocked]}>
            {isUnlocked ? `Concluído!` : `Faça ${meta} avaliações (${count}/${meta})`}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading || !stats) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ title: 'Carregando...' }} />
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen 
        options={{ 
          title: 'Conquistas',
          headerStyle: { backgroundColor: Colors.background },
          headerTitleStyle: { color: Colors.text, fontWeight: 'bold' },
          headerTintColor: Colors.text, // Cor da seta "voltar"
        }} 
      />
      
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>Baseado em Avaliações</Text>
        {conquistas.reviews.map(conq => (
          <Badge 
            key={conq.nome}
            nome={conq.nome}
            meta={conq.meta}
            count={stats.reviewsCount}
          />
        ))}

        <Text style={styles.sectionTitle}>Baseado em Placelists</Text>
         {conquistas.lists.map(conq => (
          <Badge 
            key={conq.nome}
            nome={conq.nome}
            meta={conq.meta}
            count={stats.listsCount}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos (seguindo o padrão visual do TCC)
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: 15 },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: Colors.background 
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
    marginTop: 10,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
  badgeLocked: {
    backgroundColor: '#f9f9f9', // Um pouco mais escuro que branco
    opacity: 0.7,
  },
  badgeUnlocked: {
    borderColor: Colors.primary, // Destaque na borda
  },
  badgeInfo: {
    flex: 1,
    marginLeft: 15,
  },
  badgeNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  badgeMeta: {
    fontSize: 14,
    color: Colors.grey,
    marginTop: 2,
  },
  badgeTextLocked: {
    color: Colors.grey, // Texto cinza para "trancado"
  },
});