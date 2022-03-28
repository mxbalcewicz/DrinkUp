import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import NavigationDrawer from "./src/components/NavigationDrawer";
import Home from "./src/screens/Home";
import AllDrinks from "./src/screens/AllDrinks";

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
          drawerStyle: {
            backgroundColor: "#bee1e6",
            width: "60%",
          },
        }}
      >
        <Drawer.Screen name="Home" headerShown={false} component={Home} />
        <Drawer.Screen
          name="Drinks"
          headerShown={false}
          component={AllDrinks}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
