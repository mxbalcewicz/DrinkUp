import {
  View,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import firebase from "../../config/firebase";

const screenWidth = Dimensions.get("window").width;
const numColumns = 2;
const tileSize = screenWidth / numColumns;

const MenuDetailScreen = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [drinks, setDrinks] = useState();
  const menu = route.params;

  const fetchMenuDrinks = async () => {
    const drinksIds = menu.drinks;

    const snapshot = await firebase
      .firestore()
      .collection("menuDrinks")
      .where(firebase.firestore.FieldPath.documentId(), "in", drinksIds)
      .get();

    const drinks = [];
    snapshot.forEach((doc) => {
      const { category, description, hex, imgUrl, ingredients, name } =
        doc.data();
      drinks.push({
        id: doc.id,
        category,
        description,
        hex,
        imgUrl,
        ingredients,
        name,
      });
    });
    console.log(drinks);
    setDrinks(drinks);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMenuDrinks();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffcc00" />
      </View>
    );
  }

  return (
    <SafeAreaView>
      <FlatList
        ListHeaderComponent={
          <View>
            <Image source={{ uri: menu.imgUrl }} style={styles.headerImage} />
            <View style={styles.textView}>
              <Text style={styles.titleText}>Drinks in {menu.name}</Text>
            </View>
          </View>
        }
        data={drinks}
        renderItem={({ item }) => (
          <TouchableOpacity
            // style={styles.item}
            style={{ overflow: "hidden" }}
            onPress={() => {
              navigation.navigate("ItemDetail", {
                ...item,
              });
            }}
          >
            <ImageBackground style={styles.item} source={{ uri: item.imgUrl }}>
              <Text style={styles.categoryText}>{item.name}</Text>
            </ImageBackground>
          </TouchableOpacity>
        )}
        numColumns={2}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default MenuDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  image: {
    flexGrow: 1,
    height: Dimensions.get("window").width / numColumns,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  headerImage: {
    height: 300,
    flex: 1,
    width: null,
  },
  categoryText: {
    position: "absolute",
    textAlign: "center",
    fontSize: 20,
    color: "white",
    textTransform: "capitalize",
  },
  item: {
    backgroundColor: "#313638",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: Dimensions.get("window").width / numColumns - 2,
    width: Dimensions.get("window").width / numColumns - 2,
    margin: 1,
  },
  textView: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  titleText: {
    fontSize: 30,
    color: "white",
  },
});
