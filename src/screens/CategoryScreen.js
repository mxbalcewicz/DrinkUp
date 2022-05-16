import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
  ImageBackground
} from "react-native";
import firebase from "../../config/firebase";
import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

const CategoryScreen = ({ route, navigation }) => {
  const screenWidth = Dimensions.get("window").width;
  const numColumns = 2;
  const tileSize = screenWidth / numColumns;

  const [drinks, setDrinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const data = route.params;

  const getDrinks = async () => {
    console.log(data.name);
    await firebase
      .firestore()
      .collection("drinks").where("category", "==", data.name)
      .onSnapshot((querySnapshot) => {
        const drinks = [];
        querySnapshot.docs.forEach((doc) => {
          console.log(doc.data());
          const { name, imgUrl } = doc.data();
          drinks.push({
            id: doc.id,
            name,
            imgUrl,
          });
        });
        setDrinks(drinks);
      });
    setIsLoading(false);
  };

  useState(() => {
    getDrinks();
  }, []);

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
          <View>
            <Image
              source={{uri: data.imgUrl}}
              style={styles.headerImage}
            />
            <Text>Category: {data.name}</Text>
          </View>
        }
        data={drinks}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 1 }}
            onPress={() => {
              //navigation.navigate("Category", { id: item.id, name: item.name, imgUrl: item.imgUrl });
            }}
          >
            <ImageBackground
              style={{ width: tileSize, height: tileSize }}
              source={{ uri: item.imgUrl }}
            >
              <Text style={styles.categoryText}>{item.name}</Text>
            </ImageBackground>
          </TouchableOpacity>
        )}
        numColumns={2}
        keyExtractor={(item, index) => index}
      />
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
});
