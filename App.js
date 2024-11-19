import { useEffect } from 'react';
import { LogBox } from 'react-native';

// Optionally suppress warnings
LogBox.ignoreLogs(['Warning: ...']); // Add specific warnings to ignore

export default function App() {
  return null; // Expo Router handles the rendering
}