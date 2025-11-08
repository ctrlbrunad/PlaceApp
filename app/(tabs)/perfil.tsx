import { Feather, FontAwesome } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';
import { useAuth } from '../../src/context/AuthContext';
import api from '../../src/services/api';

// Importar o modal do menu
import ProfileMenuModal from '../../components/ProfileMenuModal';

const colors = Colors;

export default function ProfileScreen() {
  const { user, logout, isLoading } = useAuth();
  const [stats, setStats] = useState({ reviews: 0, lists: 0 });
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [isMenuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }
    const fetchProfileStats = async () => {
      try {
        setIsStatsLoading(true);
        const response = await api.get('/users/me');
        const { reviewsCount, listsCount } = response.data;
        setStats({
          reviews: reviewsCount || 0,
          lists: listsCount || 0,
        });
      } catch (error) {
        console.error("Erro ao buscar estatísticas do perfil:", error);
      } finally {
        setIsStatsLoading(false);
      }
    };
    fetchProfileStats();
  }, [user]); 

  if (isLoading || !user) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      {/* Configuração do Cabeçalho com o ícone de menu */}
      <Stack.Screen
        options={{
          title: 'Perfil',
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { color: colors.text, fontWeight: 'bold' },
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => setMenuVisible(true)}
              style={{ marginRight: 16 }}
            >
              <Feather name="menu" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerLeft: () => null, 
        }}
      />
      
      {/* Conteúdo da Tela */}
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.profileCard}>
          <TouchableOpacity style={styles.avatarContainer}>
            {user.imageUrl ? ( 
              <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { borderColor: colors.primary }]}>
                <FontAwesome name="camera" size={24} color={colors.text} />
              </View>
            )}
          </TouchableOpacity>
          
          <Text style={[styles.userName, { color: colors.text }]}>{user.nome}</Text>
          <Text style={styles.userHandle}>{user.email}</Text> 

          <View style={styles.statsContainer}>
            <View style={[styles.statBox, { backgroundColor: `${colors.primary}20` }]}>
              <FontAwesome name="star" size={24} color={colors.primary} />
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {isStatsLoading ? '...' : stats.reviews}
              </Text>
              <Text style={styles.statLabel}>Avaliações</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: `${colors.primary}20` }]}>
              <FontAwesome name="list-ul" size={24} color={Colors.primary} />
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {isStatsLoading ? '...' : stats.lists}
              </Text>
              <Text style={styles.statLabel}>Listas</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal do Menu (que contém o botão "Sair") */}
      <ProfileMenuModal
        visible={isMenuVisible}
        onClose={() => setMenuVisible(false)}
        onLogout={logout} 
      />
    </>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: colors.white, 
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary, // Adicionando a borda aqui
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userHandle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statBox: {
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    width: '45%',
    backgroundColor: `${Colors.primary}20`, // Adicionando o fundo
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});