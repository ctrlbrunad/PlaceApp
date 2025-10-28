import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/context/AuthContext'; // Importa o hook

export default function PerfilScreen() {
  const { logout } = useAuth(); // Pega a função de logout do "Cérebro"

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela Perfil</Text>
      <Button title="Sair (Logout)" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, marginBottom: 20 },
});