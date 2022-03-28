import { StyleSheet, Text, View, FlatList, SafeAreaView } from "react-native";
import React, { useState } from "react";
import { Image } from "react-native-elements";
import { CheckBox, Icon } from "react-native-elements";
import { Asset } from "expo-asset";
import { TouchableOpacity } from "react-native-gesture-handler";

const Home = () => {
  const [dataSource, setDataSource] = useState([]);

  useState(() => {
    let items = Array.apply(null, Array(60)).map((v, i) => {
      return { id: i, src: "http://placehold.it/200x200?text=" + (i + 1) };
    });
    setDataSource(items);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* <Image source={ require("../../assets/favicon.png") } style={{width: "100%", height: "50%"}} /> */}
      <FlatList
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

export default Home;

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
  mainImage: {
    width: "100%",
    height: "50%",
  },
});
