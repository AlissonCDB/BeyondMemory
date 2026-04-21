import { Stack } from 'expo-router';
import { useEffect } from 'react';
import '../global.css'; 

import { getDatabase } from '../src/database/database';
import { TypeRepository } from '../src/database/repositories/typeRepository';

export default function RootLayout() {
  useEffect(() => {
    async function setup() {
      try {
        await getDatabase();
        await TypeRepository.seed();
      } catch (e) {
        console.warn(e);
      }
    }
    setup();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#4f46e5' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="form" options={{ title: 'Detalhes', presentation: 'modal' }} />
    </Stack>
  );
}