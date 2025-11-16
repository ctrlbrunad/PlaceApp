import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Colors from '../constants/Colors';
import { useAuth } from '../src/context/AuthContext';
import api from '../src/services/api';

const AVATARS = [
  'default.png', 
  'avatar1.png', 
  'avatar2.png', 
  'avatar3.png',
  'avatar4.png',
  'avatar5.png',
  'avatar6.png',
  'avatar7.png',
  'avatar8.png',
];

const avatarImages = {
  'default.png': require('../assets/images/avatares/default.png'),
  'avatar1.png': require('../assets/images/avatares/avatar1.png'),
  'avatar2.png': require('../assets/images/avatares/avatar2.png'),
  'avatar3.png': require('../assets/images/avatares/avatar3.png'),
  'avatar4.png': require('../assets/images/avatares/avatar4.png'),
  'avatar5.png': require('../assets/images/avatares/avatar5.png'),
 'avatar6.png': require('../assets/images/avatares/avatar6.png'),
 'avatar7.png': require('../assets/images/avatares/avatar7.png'),
 'avatar8.png': require('../assets/images/avatares/avatar8.png'),
};

export default function SelecionarAvatarScreen() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar_id || 'default.png');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (selectedAvatar === user?.avatar_id) {
      router.back();
      return;
    }
    setLoading(true);
    try {
      const response = await api.put('/users/me', {
        avatar_id: selectedAvatar, 
      });
      updateUser(response.data.usuario);
      Alert.alert('Sucesso!', 'Avatar atualizado.');
      router.back();
    } catch (error) {
      console.error("Erro ao salvar avatar:", error);
      Alert.alert('Erro', 'Não foi possível salvar seu avatar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Selecionar Avatar',
          headerStyle: { backgroundColor: Colors.background },
          headerTitleStyle: { color: Colors.text },
          headerTintColor: Colors.text,
        }} 
      />
      <ScrollView>
        <View style={styles.grid}>
          {AVATARS.map((avatarName) => {
            const isSelected = selectedAvatar === avatarName;
            return (
              <TouchableOpacity
                key={avatarName}
                style={[styles.avatarWrapper, isSelected && styles.avatarSelected]}
                onPress={() => setSelectedAvatar(avatarName)}
              >
                {/* --- 2. CORREÇÃO DO TIPO --- */}
                <Image 
                  source={avatarImages[avatarName as keyof typeof avatarImages]} 
                  style={styles.avatar} 
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer (correto) */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={handleSave} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.buttonText}>Salvar</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Estilos (corretos)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
  avatarWrapper: {
    padding: 10,
    margin: 10,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'transparent',
  },
  avatarSelected: {
    borderColor: Colors.primary,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.lightGrey,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});