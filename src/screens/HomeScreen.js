import {
  View,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  ActivityIndicator,
  ImageBackground,
} from "react-native";

import React, { useState, useEffect } from "react";
import firebase from "../../config/firebase";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as FirestoreService from "../services/FirestoreService";

const HomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [dataSource, setDataSource] = useState([]); // dummy data

  const getDummy = () => {
    let items = Array.apply(null, Array(10)).map((v, i) => {
      return {
        id: i,
        src: "http://via.placeholder.com/200x200?text=" + (i + 1),
      };
    });
    setDataSource(items);
  };

  const getImageUrl = async (imgName) => {
    const imgUrl = "";
    const ref = firebase.storage().ref("categories/" + imgName);
    const url = await ref.getDownloadURL().then((url) => (imgUrl = url));
    // await firebase.storage().ref('categories/' + imgName).getDownloadURL().then((url) => object.imgUrl = url)

    console.log(imgUrl);
    return imgUrl;
  };

  const getCategories = async () => {
    await firebase
      .firestore()
      .collection("categories")
      .onSnapshot((querySnapshot) => {
        const categories = [];
        querySnapshot.docs.forEach((doc) => {
          const { name, imgUrl } = doc.data();
          // const imgRef = firebase.storage().ref("categories/" + item.imgName);
          // imgRef.getDownloadURL().then((url) => {
          //   categories.push({...item, imgUrl: url})
          // });
          categories.push({
            id: doc.id,
            name,
            imgUrl,
          });
        });
        setCategories(categories);
      });

    // categories.forEach((item) => {

    // });
    // setCategories(categories)
    setIsLoading(false);
  };

  useEffect(() => {
    getCategories();
    getDummy();
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
              source={require("../../assets/images/homescreen.jpg")}
              style={styles.headerImage}
            />
            <Text>Categories from database</Text>
          </View>
        }
        data={categories}
        renderItem={({ item }) => (
          <View style={{ flex: 1, flexDirection: "column", margin: 1 }}>
            <TouchableOpacity style={{ height: 200, width: 200 }}>
              {/* <Image style={styles.image} source={{ uri: item.imgUrl }} /> */}
              <ImageBackground style={styles.image} source={{uri: item.imgUrl }}>
                <Text style={styles.categoryText}>{item.name}</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
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
    textS
    
  },
});
