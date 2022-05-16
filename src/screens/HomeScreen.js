import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Image,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import firebase from "../../config/firebase";
import { TouchableOpacity } from "react-native-gesture-handler";

const HomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const screenWidth = Dimensions.get("window").width;
  const numColumns = 2;
  const tileSize = screenWidth / numColumns;

  const getCategories = async () => {
    await firebase
      .firestore()
      .collection("categories")
      .onSnapshot((querySnapshot) => {
        const categories = [];
        querySnapshot.docs.forEach((doc) => {
          const { name, imgUrl } = doc.data();
          categories.push({
            id: doc.id,
            name,
            imgUrl,
          });
        });
        setCategories(categories);
      });
    setIsLoading(false);
  };

  useEffect(() => {
    getCategories();
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
          <View style={{ flex: 1 }}>
            <Image
              source={require("../../assets/images/homescreen.jpg")}
              style={styles.headerImage}
            />
            <Text>Categories from database</Text>
          </View>
        }
        data={categories}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 1 }}
            onPress={() => {
              navigation.navigate("Category", { id: item.id, name: item.name, imgUrl: item.imgUrl });
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
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity onPress={() => console.log(categories)}>
        <Text>PRINT FETCHED DATA</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  image: {
    flexGrow: 1,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
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
});
