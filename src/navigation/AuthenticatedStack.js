import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';


const Stack = createStackNavigator();

export default function AuthenticatedStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name='Login' component={LoginScreen} />
    </Stack.Navigator>
  );
}