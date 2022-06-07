import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
} from "react-native";
import firebase from "../../config/firebase";
import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useIsFocused } from "@react-navigation/native";

const CategoryScreen = ({ route, navigation }) => {
  const screenWidth = Dimensions.get("window").width;
  const numColumns = 2;
  const tileSize = screenWidth / numColumns;
  const isFocused = useIsFocused();

  const [drinks, setDrinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const data = route.params;

  const getDrinks = async () => {
    console.log(data.name);
    await firebase
      .firestore()
      .collection("drinks")
      .where("category", "==", data.name)
      .onSnapshot((querySnapshot) => {
        const drinks = [];
        querySnapshot.docs.forEach((doc) => {
          //console.log(doc.data());
          const { name, ingredients, hex, description, imgUrl, category } =
            doc.data();
          drinks.push({
            id: doc.id,
            name,
            ingredients,
            hex,
            description,
            imgUrl,
            category,
          });
        });
        setDrinks(drinks);
      });
    setIsLoading(false);
  };

  useEffect(() => {
    if (isFocused) {
      getDrinks();
    }
  }, [isFocused]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffcc00" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.container}>
            <ImageBackground
              source={{ uri: data.imgUrl }}
              style={styles.headerImage}
            >
              <View style={styles.textView}>
                <Text style={styles.titleText}>Category: {data.name}</Text>
              </View>
            </ImageBackground>
          </View>
        }
        data={drinks}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 1 }}
            onPress={() => {
              console.log("Clicked item:", item);
              navigation.navigate("ItemDetail", { ...item });
            }}
          >
            <ImageBackground
              style={{ width: tileSize, height: tileSize }}
              source={{ uri: item.imgUrl }}
            >
              <View style={styles.textView}>
                <Text style={styles.categoryText}>{item.name}</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        )}
        numColumns={2}
        keyExtractor={(item, index) => index}
      />
      <TouchableOpacity
        onPress={() => {
          console.log(drinks);
          console.log(data);
        }}
      >
        <Text>PRINT FETCHED DATA</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  imageThumbnail: {
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
  headerImage: {
    height: 300,
    flex: 1,
    width: null,
  },
  categoryText: {
    fontSize: 20,
    color: "white",
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
