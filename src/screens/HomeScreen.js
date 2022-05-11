import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Image,
  ActivityIndicator,
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

  const getCategories = async () => {
    await firebase
      .firestore()
      .collection("categories")
      .onSnapshot((querySnapshot) => {
        const categories = [];
        querySnapshot.docs.forEach((doc) => {
          const { name, imgName } = doc.data();
          categories.push({
            id: doc.id,
            name,
            imgName,
          });
        });
        setCategories(categories);
      });
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
            <TouchableOpacity style={{height:200, width:200}}>
              {/* <Image style={styles.imageThumbnail} source={{ uri: item.src }} /> */}
              <Text>{item.name}</Text>
            </TouchableOpacity>
          </View>
        )}
        numColumns={2}
        keyExtractor={(item, index) => index}
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
