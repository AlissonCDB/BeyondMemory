import { Stack } from 'expo-router';
import { useEffect } from 'react';
import '../global.css'; 

import { getDatabase } from '../src/database/db';


export default function RootLayout() {
  useEffect(() => {
    async function setup() {
      try {
        await getDatabase();
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
    </Stack>
  );
}