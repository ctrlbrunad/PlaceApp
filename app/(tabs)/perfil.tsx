import { Feather, FontAwesome } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


import Colors from '@/constants/Colors';


import { useAuth } from '@/src/context/AuthContext'; //

const colors = Colors;

export default function ProfileScreen() {
  // 1. Pegar o USUÁRIO REAL e a FUNÇÃO DE LOGOUT do contexto
 
  const { user, logout, isLoading } = useAuth();

  // 2. Tela de Loading
  // Se 'isLoading' for true ou 'user' ainda for nulo, 
  //  um loading.
  if (isLoading || !user) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // 3. Tela de Perfil (agora temos o 'user')
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Perfil',
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { color: colors.text, fontWeight: 'bold' },
          headerShadowVisible: false,
          headerRight: () => (
            // 4. BOTÃO DE LOGOUT que você pediu
            <TouchableOpacity onPress={logout} style={{ marginRight: 16 }}>
              <Feather name="log-out" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.profileCard}>
          <TouchableOpacity style={styles.avatarContainer}>
            {/* 5. Usar dados REAIS (user.imageUrl) */}
            {user.imageUrl ? ( 
              <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { borderColor: colors.primary }]}>
                <FontAwesome name="camera" size={24} color={colors.text} />
              </View>
            )}
          </TouchableOpacity>

          {/* 6. Usar dados REAIS (user.nome e user.email) 
               Seu authController.js envia 'nome' e 'email' */}
          <Text style={[styles.userName, { color: colors.text }]}>{user.nome}</Text>
          <Text style={styles.userHandle}>{user.email}</Text> 

          <View style={styles.statsContainer}>
            {/* NOTA: As contagens (reviews, lists) ainda não estão conectadas.
              Elas virão do backend na próxima etapa (via GET /users/me)
            */}
            <View style={[styles.statBox, { backgroundColor: `${colors.primary}20` }]}>
              <FontAwesome name="star" size={24} color={colors.primary} />
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {user.reviews || 0} {/* (Ainda fictício) */}
              </Text>
              <Text style={styles.statLabel}>Avaliações</Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: `${colors.primary}20` }]}>
              <FontAwesome name="list-ul" size={24} color={colors.primary} />
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {user.lists || 0} {/* (Ainda fictício) */}
              </Text>
              <Text style={styles.statLabel}>Listas</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

// (Os estilos permanecem os mesmos da versão anterior, 
// apenas adicionei um 'center' para o loading)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: { // Para centralizar o ActivityIndicator
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