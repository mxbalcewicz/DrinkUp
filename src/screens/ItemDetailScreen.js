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
import React, { useState, useEffect } from 'react'

const ItemDetailScreen = ({route, navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [drink, setDrink] = useState(route.params);

  const updateFavouriteDrinks = () => {
    console.log("Entered drink details:", drink); 
  }

  const addToFavourites = async ( itemHex ) => {
    const docRef = firebase.firestore().collection("users").doc(userId);
    console.log(userId);
    docRef.update({favourites: itemHex}).then(()=>console.log('Updated'));
  }

  useEffect(() => {
    updateFavouriteDrinks();
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
      <Button title="Add to fav" onPress={addToFavourites(drink.hex)}/>
      <Image source={{uri: drink.imgUrl}} />
    </SafeAreaView>
  )
}

export default ItemDetailScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
})