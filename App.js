import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StudentProvider } from './src/context/StudentContext';
import MainNavigator from './src/navigation/MainNavigator';

export default function App() {
  return (
    <StudentProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </StudentProvider>
  );
}
