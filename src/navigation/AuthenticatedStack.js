import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import FavouriteDrinks from "../screens/FavouriteDrinks";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import QRScannerScreen from "../screens/QRScannerScreen";

import firebase from "../../config/firebase";
import CategoryScreen from "../screens/CategoryScreen";
import ItemDetailScreen from "../screens/ItemDetailScreen";
import ScannedMenusScreen from "../screens/ScannedMenusScreen";
import MenuDetailScreen from "../screens/MenuDetailScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
// const auth = Firebase.auth();

export default function AuthenticatedStack() {
  const handleUserSignOut = async () => {
    try {
      await firebase.auth().signOut();
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
            <DrawerItem label="Logout" onPress={handleUserSignOut} />
          </DrawerContentScrollView>
        );
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen
        name="Category"
        component={CategoryScreen}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="ItemDetail"
        component={ItemDetailScreen}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="MenuDetailScreen"
        component={MenuDetailScreen}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen name="Favourites" component={FavouriteDrinks} />
      <Drawer.Screen name="Scanned Menus" component={ScannedMenusScreen} />
      <Drawer.Screen name="QR Scanner" component={QRScannerScreen} />
    </Drawer.Navigator>
  );
}
