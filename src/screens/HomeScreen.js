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
} from "react-native";

import React, { useState, useEffect } from "react";
import firebase from "../../config/firebase";
import { TouchableOpacity } from "react-native-gesture-handler";

const screenWidth = Dimensions.get("window").width;
const numColumns = 2;
const tileSize = screenWidth / numColumns;

const HomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    console.log(tileSize);
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
    <SafeAreaView>
      <FlatList
        ListHeaderComponent={
          <View>
            <Image
              source={require("../../assets/images/homescreen.jpg")}
              style={styles.headerImage}
            />
          </View>
        }
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            // style={styles.item}
            style={{overflow:"hidden"}}
            onPress={() => {
              navigation.navigate("Category", {
                id: item.id,
                name: item.name,
                imgUrl: item.imgUrl,
              });
            }}
          >
            <ImageBackground
              style={styles.item}
              source={{ uri: item.imgUrl }}
            >
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

export default HomeScreen;

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
    backgroundColor: "#e5b513",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: Dimensions.get("window").width / numColumns - 2,
    width: Dimensions.get("window").width / numColumns -2,
    margin: 1,
  },
});
