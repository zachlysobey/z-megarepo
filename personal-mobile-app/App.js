import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { SessionProvider } from './context/SessionContext';
import HomeScreen from './screens/HomeScreen';
import StrengthSessionScreen from './screens/StrengthSessionScreen';
import SessionTypeSelectionScreen from './screens/SessionTypeSelectionScreen';
import SessionInputScreen from './screens/SessionInputScreen';
import SessionDetailScreen from './screens/SessionDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <SessionProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home' }}
        />
        <Stack.Screen
          name="StrengthSession"
          component={StrengthSessionScreen}
          options={{ title: 'Strength Sessions' }}
        />
        <Stack.Screen
          name="SessionTypeSelection"
          component={SessionTypeSelectionScreen}
          options={{ title: 'Choose Session Template' }}
        />
        <Stack.Screen
          name="SessionInput"
          component={SessionInputScreen}
          options={{ title: 'Session Input' }}
        />
        <Stack.Screen
          name="SessionDetail"
          component={SessionDetailScreen}
          options={{ title: 'Session Details' }}
        />
      </Stack.Navigator>
        </NavigationContainer>
      </SessionProvider>
    </SafeAreaProvider>
  );
}
