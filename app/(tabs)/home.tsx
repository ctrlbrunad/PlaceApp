// app/(tabs)/home.tsx (VERSÃO SIMPLES PARA TESTE)
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela Home Funcionando!</Text>
    </View>
  );
}

// Estilos básicos sem nenhuma importação externa
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#FDF8E1' // Cor de fundo direta
  },
  text: { 
    fontSize: 20,
    color: '#4A2C2A' // Cor de texto direta
  },
});