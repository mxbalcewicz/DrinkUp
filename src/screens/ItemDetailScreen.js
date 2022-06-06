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
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { IconButton, Colors } from "react-native-paper";
import firebase from "../../config/firebase";

const ItemDetailScreen = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const drink = route.params;
  const [userFavourites, setUserFavourites] = useState([]);
  const [isFavourite, setIsFavourite] = useState(false);
  const [userId, setUserId] = useState();
  const isFocused = useIsFocused();

  const fetchUserId = () => {
    const userId = firebase.auth().currentUser.uid;
    setUserId(userId);
    return userId;
  };

  const fetchFavouriteDrinksIds = async (userId) => {
    const snapshot = await firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .get();

    setUserFavourites(snapshot.data().favourites);
    console.log(userFavourites);
    if (snapshot.data().favourites.includes(drink.hex)) {
      setIsFavourite(true);
    } else {
      setIsFavourite(false);
    }
  };

  const fetchData = async () => {
    const userId = fetchUserId();
    const favouriteIds = await fetchFavouriteDrinksIds(userId);
  };

  const removeFromFavourites = async (data) => {
    const docRef = firebase.firestore().collection("users").doc(userId);
    docRef.update({ favourites: firebase.firestore.FieldValue.arrayRemove(data) });
    console.log("Fav removed");
    fetchFavouriteDrinksIds(userId);
  };

  const addToFavourites = async (data) => {
    console.log("FavData to add", data);
    // const value = firebase.firestore.FieldValue.arrayUnion(data);
    const docRef = firebase.firestore().collection("users").doc(userId);
    // console.log(userId);
    docRef.update({ favourites: firebase.firestore.FieldValue.arrayUnion(data) });
    console.log("Updated");
    fetchFavouriteDrinksIds(userId);
  };

  const scanNewMenu = async (data) => {
    const value = firebase.firestore.FieldValue.arrayUnion(data);
    const docRef = firebase.firestore().collection("users").doc(userId);
    console.log(userId);
    docRef.update({scannedMenus: value}).then(()=>console.log('Updated'));
  }

  useEffect(() => {
    fetchData();
    setIsLoading(false);
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
      <Text>ItemDetail</Text>
      <Text>{drink.name}</Text>
      <Text>{drink.description}</Text>
      <Text>{drink.ingredients}</Text>
      <Text>{drink.hex}</Text>
      <IconButton
        icon={isFavourite ? "star" : "star-outline"}
        color={isFavourite ? Colors.yellow500 : Colors.black500}
        size={24}
        onPress={
          isFavourite ? () => removeFromFavourites(drink.hex) : () => addToFavourites(drink.hex)
        }
      />
      <Image source={{ uri: drink.imgUrl }} />
    </SafeAreaView>
  );
};

export default ItemDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
});
