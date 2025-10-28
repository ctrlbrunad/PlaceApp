import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    // O 'Stack' é um navegador de "pilha" (sem menu de abas)
    <Stack>
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="register" options={{ title: 'Cadastro' }} />
    </Stack>
  );
}