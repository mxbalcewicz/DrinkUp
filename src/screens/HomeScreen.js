import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

const HomeScreen = ({ navigation }) => {
  const [dataSource, setDataSource] = useState([]);

  useState(() => {
    let items = Array.apply(null, Array(10)).map((v, i) => {
      return {
        id: i,
        src: "http://via.placeholder.com/200x200?text=" + (i + 1),
      };
    });
    setDataSource(items);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <Image
            source={require("../../assets/images/homescreen.jpg")}
            style={styles.headerImage}
          />
        }
        data={dataSource}
        renderItem={({ item }) => (
          <View style={{ flex: 1, flexDirection: "column", margin: 1 }}>
            <TouchableOpacity>
              <Image style={styles.imageThumbnail} source={{ uri: item.src }} />
            </TouchableOpacity>
          </View>
        )}
        numColumns={2}
        keyExtractor={(item, index) => index}
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
