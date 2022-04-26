import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList
} from "@react-navigation/drawer";

import FavouriteDrinks from "../screens/FavouriteDrinks";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import Firebase from "../../config/firebase";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const auth = Firebase.auth();

export default function AuthenticatedStack() {
  
  const handleUserSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => {
        return (
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem
              label="Logout"
              onPress={handleUserSignOut}
            />
          </DrawerContentScrollView>
        );
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Favourites" component={FavouriteDrinks} />
    </Drawer.Navigator>
  );
}
