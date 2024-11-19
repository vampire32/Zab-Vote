import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { paddingBottom: 10, height: 60 },
        tabBarActiveTintColor: '#4834D4',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="MainScreen"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
          tabBarLabel: 'Home',
        }}
      />


      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
}
