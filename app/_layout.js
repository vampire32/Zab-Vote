import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* You don't need to define the screens here - Expo Router will handle that */}
    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

    </Stack>
  );
}