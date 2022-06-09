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
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import firebase from "../../config/firebase";
import { useIsFocused } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;
const numColumns = 2;
const tileSize = screenWidth / numColumns;

const ScannedMenusScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [menus, setMenus] = useState();
  const [userId, setUserId] = useState();
  const [empty, setEmpty] = useState(false);
  const isFocused = useIsFocused();

  const fetchUserId = () => {
    const userId = firebase.auth().currentUser.uid;
    setUserId(userId);
    return userId;
  };

  const fetchMenusIdsList = async (userId) => {
    const snapshot = await firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .get();

    return snapshot.data().scannedMenus;
  };

  const fetchMenusObjectsList = async (menusIds) => {
    const menusObjects = [];
    if (menusIds.length !== 0) {
      const snapshot = await firebase
        .firestore()
        .collection("menus")
        .where(firebase.firestore.FieldPath.documentId(), "in", menusIds)
        .get();

      snapshot.forEach((doc) => {
        const { name, drinks, imgUrl } = doc.data();
        menusObjects.push({
          imgUrl: imgUrl,
          name: name,
          drinks: drinks,
        });
      });
    } else {
      setEmpty(true);
    }
    setMenus(menusObjects);
    console.log(menusObjects);
    setIsLoading(false);
  };

  const fetchData = async () => {
    const userId = fetchUserId();
    const menusIds = await fetchMenusIdsList(userId);
    const menusObjects = await fetchMenusObjectsList(menusIds);
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

  return (
    <SafeAreaView>
      <FlatList
        ListHeaderComponent={
          <View>
            <Image
              source={require("../../assets/images/scannedMenu.jpg")}
              style={styles.headerImage}
            />
            <View style={styles.textView}>
              <Text style={styles.titleText}>Your menus</Text>
            </View>
            {empty ? (
              <Text style={styles.emptyText}>Empty scanned menus</Text>
            ) : null}
          </View>
        }
        data={menus}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ overflow: "hidden" }}
            onPress={() => {
              navigation.navigate("MenuDetailScreen", {
                ...item,
              });
            }}
          >
            <ImageBackground style={styles.item} source={{ uri: item.imgUrl }}>
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

export default ScannedMenusScreen;
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
    backgroundColor: "#313638",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: Dimensions.get("window").width / numColumns - 2,
    width: Dimensions.get("window").width / numColumns - 2,
    margin: 1,
  },
  textView: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  titleText: {
    fontSize: 30,
    color: "white",
  },
  emptyText: {
    backgroundColor: "grey",
    borderRadius: 5,
    margin: 1,
    paddingBottom: 5,
    paddingTop: 5,
    textAlign: "center",
    fontWeight: "bold",
  },
});
