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
    docRef.update({
      favourites: firebase.firestore.FieldValue.arrayRemove(data),
    });
    console.log("Fav removed");
    fetchFavouriteDrinksIds(userId);
  };

  const addToFavourites = async (data) => {
    console.log("FavData to add", data);
    // const value = firebase.firestore.FieldValue.arrayUnion(data);
    const docRef = firebase.firestore().collection("users").doc(userId);
    // console.log(userId);
    docRef.update({
      favourites: firebase.firestore.FieldValue.arrayUnion(data),
    });
    console.log("Updated");
    fetchFavouriteDrinksIds(userId);
  };

  const scanNewMenu = async (data) => {
    const value = firebase.firestore.FieldValue.arrayUnion(data);
    const docRef = firebase.firestore().collection("users").doc(userId);
    console.log(userId);
    docRef.update({ scannedMenus: value }).then(() => console.log("Updated"));
  };

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

  const listItems = drink.ingredients.map((el) => (
    <Text style={{ fontSize: 20, marginLeft: 20 }}>- {el}</Text>
  ));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerImage}>
        <ImageBackground
          style={styles.drinkImage}
          imageStyle={{ borderRadius: 20 }}
          source={{ uri: drink.imgUrl }}
        ></ImageBackground>
      </View>
      <View style={styles.containerTitle}>
        <View style={styles.containerBox}>
          <View style={styles.innerContainer}>
            <Text style={styles.drinkName}>{drink.name}</Text>
            <View style={styles.favouriteContainer}>
              <Text>Add to favourite:</Text>
              <IconButton
                icon={isFavourite ? "star" : "star-outline"}
                color={isFavourite ? Colors.yellow500 : Colors.black500}
                size={40}
                onPress={
                  isFavourite
                    ? () => removeFromFavourites(drink.hex)
                    : () => addToFavourites(drink.hex)
                }
              />
            </View>
          </View>
        </View>
        <View style={styles.containerBox}>
          <View style={styles.innerContainerIngredients}>
            <Text style={{ fontSize: 24 }}>List of ingredients:</Text>
            <View style={styles.ingredientsContainer}>{listItems}</View>
          </View>
        </View>
      </View>
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
  containerImage: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
    marginTop: 50,
    marginLeft: 20,
    marginRight: 20,
  },
  drinkImage: {
    height: 250,
    flex: 1,
    width: null,
  },
  containerTitle: {
    width: "100%",
    height: "60%",
    padding: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    marginRight: 20,
    marginLeft: 20,
  },
  containerBox: {
    width: "100%",
    height: "20%",
    padding: 5,
  },
  innerContainer: {
    flex: 1,
    alignContent: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  drinkName: {
    fontSize: 40,
    fontWeight: "bold",
  },
  favouriteContainer: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  innerContainerIngredients: {
    flex: 1,
    alignContent: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "column",
    flexWrap: "wrap",
  },
  ingredientsContainer: {
    flex: 1,
  },
});
