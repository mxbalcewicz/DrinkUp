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
  const loggedIn = route.params.loggedIn;
  const [userFavourites, setUserFavourites] = useState([]);
  const [isFavourite, setIsFavourite] = useState();
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

    const ids = snapshot.data().favourites;

    if (ids.includes(drink.hex)) {
      setIsFavourite(true);
    } else {
      setIsFavourite(false);
    }
  };

  // const handleFavIcon = (ids) => {
  //   console.log("fav ids", ids);
  //   if (ids.includes(drink.hex)) {
  //     setIsFavourite(true);
  //   } else {
  //     setIsFavourite(false);
  //   }
  // }

  const fetchData = async () => {
    if (loggedIn) {
      const userId = fetchUserId();
      const favouriteIds = await fetchFavouriteDrinksIds(userId);
      // const favIcon = handleFavIcon(favouriteIds);
    }

    setIsLoading(false);
  };

  const removeFromFavourites = async (data) => {
    const docRef = firebase.firestore().collection("users").doc(userId);
    docRef.update({
      favourites: firebase.firestore.FieldValue.arrayRemove(data),
    });
    console.log("Fav removed");
    // fetchFavouriteDrinksIds(userId);
    fetchData();
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
    // fetchFavouriteDrinksIds(userId);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [isFocused]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffcc00" />
      </View>
    );
  }

  const listItems = drink.ingredients.map((el) => (
    <Text style={{ fontSize: 14 }}>- {el}</Text>
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

      <View style={styles.containerContent}>
        <View style={styles.titleContainer}>
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>{drink.name}</Text>
          {loggedIn ? (
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
          ) : null}
        </View>

        <View style={styles.ingredientsContainer}>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>
            List of ingredients:
          </Text>
          <View style={styles.ingredientsList}>{listItems}</View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
            }}
          >
            How to prepare:
          </Text>
          <Text style={{ fontSize: 14 }}>{drink.description}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ItemDetailScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  containerImage: {
    flex: 2,
  },
  containerContent: {
    flex: 5,
    marginRight: 15,
    marginLeft: 15,
  },
  drinkImage: {
    width: null,
    height: "95%",
    marginTop: 20,
    marginRight: 15,
    marginLeft: 15,
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  favouriteContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginRight: 10,
    marginTop: 10,
  },
  ingredientsContainer: {
    flex: 2,
    backgroundColor: "#A9B4C2",
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
  },
  ingredientsList: {
    marginLeft: 20,
  },
  descriptionContainer: {
    flex: 2,
    backgroundColor: "#A9B4C2",
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
  },
});
