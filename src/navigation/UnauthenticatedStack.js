import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from "../screens/HomeScreen";
import RegisterScreen from '../screens/RegisterScreen';
import Firebase from '../../config/firebase';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const auth = Firebase.auth();

export default function UnauthenticatedStack() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name='Home' component={HomeScreen} />
      <Drawer.Screen name='Login' component={LoginScreen} />
      <Drawer.Screen name='Register' component={RegisterScreen} />
    </Drawer.Navigator>
  );
}