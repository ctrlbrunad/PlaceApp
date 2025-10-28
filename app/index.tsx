// app/index.tsx (O NOVO PONTO DE ENTRADA)
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Colors from '../constants/Colors'; // Importa suas cores

export default function IndexScreen() {
  // Esta tela é o ponto de entrada (a rota "/").
  // Ela será exibida MUITO brevemente.

  // O "porteiro" (app/_layout.tsx) está envolvendo esta tela.
  // O useEffect do "porteiro" vai rodar, checar o AuthContext,
  // e IMEDIATAMENTE redirecionar para /login ou /home.

  // Nós só mostramos um "carregando" para cobrir esse "piscar" de tela.
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background, // Usa sua cor de fundo
  },
});