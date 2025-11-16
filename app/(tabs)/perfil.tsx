import { Feather, FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native'; // --- 2. IMPORTAR 'useFocusEffect' ---
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react'; // --- 1. IMPORTAR 'useCallback' ---
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';
import { useAuth } from '../../src/context/AuthContext';
import api from '../../src/services/api';

import ProfileMenuModal from '../../components/ProfileMenuModal';

const colors = Colors;

// ... (Interface MinhaReview)
interface MinhaReview {
  id: string | number;
  nota: number;
  comentario: string;
  data: string;
  estabelecimento_nome: string;
  estabelecimento_id: string;
}

// ... (avatarImages)
const avatarImages = {
  'default.png': require('../../assets/images/avatares/default.png'),
  'avatar1.png': require('../../assets/images/avatares/avatar1.png'),
  'avatar2.png': require('../../assets/images/avatares/avatar2.png'),
  'avatar3.png': require('../../assets/images/avatares/avatar3.png'),
  'avatar4.png': require('../../assets/images/avatares/avatar4.png'),
  'avatar5.png': require('../../assets/images/avatares/avatar5.png'),
  'avatar6.png': require('../../assets/images/avatares/avatar6.png'),
  'avatar7.png': require('../../assets/images/avatares/avatar7.png'),
  'avatar8.png': require('../../assets/images/avatares/avatar8.png'),
};

export default function ProfileScreen() {
  const { user, logout, isLoading } = useAuth();
  
  const [stats, setStats] = useState({ reviews: 0, lists: 0 });
  const [reviews, setReviews] = useState<MinhaReview[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  const [isMenuVisible, setMenuVisible] = useState(false);
  const router = useRouter(); 

  // --- 3. SUBSTITUIR 'useEffect' POR 'useFocusEffect' ---
  // Isso garante que os dados sejam recarregados toda vez
  // que o usuário visitar esta aba.
  useFocusEffect(
    useCallback(() => {
      // Se o usuário não estiver logado, não faz nada
      if (!user) {
        setIsDataLoading(false); // Para o loading
        return;
      }

      const fetchProfileData = async () => {
        try {
          setIsDataLoading(true);
          
          const [statsRes, reviewsRes] = await Promise.all([
            api.get('/users/me'),        
            api.get('/reviews/me') 
          ]);

          const { reviewsCount, listsCount } = statsRes.data;
          setStats({
            reviews: reviewsCount || 0,
            lists: listsCount || 0,
          });
          
          setReviews(reviewsRes.data.data);

        } catch (error) {
          console.error("Erro ao buscar dados do perfil:", error);
          Alert.alert("Erro", "Não foi possível carregar todos os dados do perfil.");
        } finally {
          setIsDataLoading(false);
        }
      };

      fetchProfileData();

    }, [user]) // A dependência [user] garante que ele também rode se o usuário logar/deslogar
  ); 

  // ... (if isLoading - permanece o mesmo)
  if (isLoading || !user) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      {/* ... (Stack.Screen - permanece o mesmo) */}
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
      
      {/* ... (ScrollView e todo o JSX - permanecem os mesmos) */}
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={() => router.push('/selecionar-avatar')}
          >
            <Image 
              source={avatarImages[ (user?.avatar_id || 'default.png') as keyof typeof avatarImages ]} 
              style={styles.avatar} 
            />
          </TouchableOpacity>
          
          <Text style={[styles.userName, { color: colors.text }]}>{user.nome}</Text>
          <Text style={styles.userHandle}>{user.email}</Text> 

          <View style={styles.statsContainer}>
            <View style={[styles.statBox, { backgroundColor: `${colors.primary}20` }]}>
              <FontAwesome name="star" size={24} color={colors.primary} />
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {isDataLoading ? '...' : stats.reviews}
              </Text>
              <Text style={styles.statLabel}>Avaliações</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: `${colors.primary}20` }]}>
              <FontAwesome name="list-ul" size={24} color={colors.primary} />
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {isDataLoading ? '...' : stats.lists}
              </Text>
              <Text style={styles.statLabel}>Listas</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Avaliações Recentes</Text>
        {isDataLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : reviews.length === 0 ? (
          <Text style={styles.emptyText}>Você ainda não fez nenhuma avaliação.</Text>
        ) : (
          reviews.slice(0, 3).map((review) => (
            <TouchableOpacity 
              key={review.id} 
              style={styles.reviewCard} 
              onPress={() => router.push(`/estabelecimento/${review.estabelecimento_id}`)}
            >
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewEstabelecimento}>{review.estabelecimento_nome}</Text>
                <View style={styles.reviewRating}>
                  <Text style={styles.reviewRatingText}>{review.nota}</Text>
                  <FontAwesome name="star" size={12} color={Colors.primary} />
                </View>
              </View>
              {review.comentario ? (
                <Text style={styles.reviewComment} numberOfLines={2}>{review.comentario}</Text>
              ) : (
                <Text style={styles.reviewCommentEmpty}>(Sem comentário)</Text>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <ProfileMenuModal
        visible={isMenuVisible}
        onClose={() => setMenuVisible(false)}
        onLogout={logout} 
      />
    </>
  );
}

// --- Estilos (Os mesmos de antes) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, 
  },
  scrollContent: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background, 
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
    borderRadius: 63, 
    borderWidth: 3,
    borderColor: colors.primary,
    overflow: 'hidden',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.lightGrey,
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
    backgroundColor: `${Colors.primary}20`, 
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.grey,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  reviewCard: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewEstabelecimento: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.text,
    flex: 1, 
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary}20`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 10,
  },
  reviewRatingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.text,
    marginRight: 4,
  },
  reviewComment: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
  },
  reviewCommentEmpty: {
    fontSize: 14,
    color: Colors.grey,
    fontStyle: 'italic',
  },
});