import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";
import firebase from "../../config/firebase";

const FavouriteDrinks = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [favouriteDrinksIds, setFavouriteDrinksIds] = useState([]);
  const [userId, setUserId] = useState();
  const [drinks, setDrinks] = useState([]);

  const getData = () => {
    const userId = firebase.auth().currentUser.uid;
    setUserId(userId);

    const fetchData = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .onSnapshot((documentSnapshot) => {
        setFavouriteDrinksIds(documentSnapshot.data().favourites);
      });

    const favouriteDrinks = firebase
      .firestore()
      .collection("drinks")
      .where(
        firebase.firestore.FieldPath.documentId(),
        "in",
        favouriteDrinksIds
      )
      .onSnapshot((querySnapshot) => {
        querySnapshot.docs.forEach((doc) => {
          const { hex, category, description, name, imgUrl, ingredients } =
            doc.data();
          drinks.push({
            id: doc.id,
            hex,
            category,
            description,
            name,
            imgUrl,
            ingredients,
          });
        });
        setDrinks(drinks);
      });
    setIsLoading(false);
  };

  const fetchUserId = async () => {
    const userId = await firebase.auth().currentUser.uid;
    setUserId(userId);
    return userId;
  };

  const fetchFavouriteDrinksIds = async (userId) => {
    await firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .get().then((documentSnapshot) => {
        setFavouriteDrinksIds(documentSnapshot.data().favourites);
      });
    return favouriteDrinksIds;
  };

  const fetchFavouriteDrinks = async (drinksIds) => {
    await firebase
      .firestore()
      .collection("drinks")
      .where(
        firebase.firestore.FieldPath.documentId(),
        "in",
        favouriteDrinksIds
      )
      .get().then((querySnapshot) => {
        querySnapshot.docs.forEach((doc) => {
          const { hex, category, description, name, imgUrl, ingredients } =
            doc.data();
          console.log(doc.data());
          drinks.push({
            id: doc.id,
            hex,
            category,
            description,
            name,
            imgUrl,
            ingredients,
          });
        });
        setDrinks(drinks);
      });
    setIsLoading(false);
  };

  const fetchData = async () => {
    const userId = await fetchUserId();
    const favouriteDrinksIds = await fetchFavouriteDrinksIds(userId);
    const favouriteDrinksObjects = await fetchFavouriteDrinks(
      favouriteDrinksIds
    );
  };

  useEffect(() => {
    fetchData();
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
      <Text>FavouriteDrinks of user {userId}</Text>
      <Button
        title="user fav drinks ids"
        onPress={() => console.log("Favourite drinks:", favouriteDrinksIds)}
      />
      <Button
        title="drink objects"
        onPress={() => console.log("Pulled drinks objects:", drinks)}
      />
    </SafeAreaView>
  );
};

export default FavouriteDrinks;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
});
