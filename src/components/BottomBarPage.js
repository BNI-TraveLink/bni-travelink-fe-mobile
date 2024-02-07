import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";

const BottomBarPage = () => {
  const [fontsLoaded] = useFonts({});
  const navigation = useNavigation();

  const handleHomePage = () => {
    navigation.navigate("HomePage");
  };

  const handleHistory = () => {
    navigation.navigate("History");
  };

  const handleTransaction = () => {
    navigation.navigate("Transaction");
  };

  const handleFavorite = () => {
    navigation.navigate("Favorite");
  };

  const handleSetting = () => {
    navigation.navigate("Setting");
  };

  if (fontsLoaded) {
    return (
      <View style={styles.tabBarContent}>
        <TouchableOpacity onPress={handleHomePage} style={styles.tabBarItem}>
          <Image
            source={require("../images/home-item.png")}
            style={{ width: 35, height: 35 }}
          />
          <Text style={styles.tittleBottomBar}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleHistory} style={styles.tabBarItem}>
          <Image
            source={require("../images/history-item.png")}
            style={{ width: 35, height: 35 }}
          />
          <Text style={styles.tittleBottomBar}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleTransaction}
          style={styles.tabBarItem}
        >
          <Image
            source={require("../images/qris2-item.png")}
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 90,
              height: 90,
              top: -20,
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleFavorite} style={styles.tabBarItem}>
          <Image
            source={require("../images/favorite-item.png")}
            style={{ width: 35, height: 35 }}
          />
          <Text style={styles.tittleBottomBar}>Favorite</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSetting} style={styles.tabBarItem}>
          <Image
            source={require("../images/setting-item.png")}
            style={{ width: 35, height: 35 }}
          />
          <Text style={styles.tittleBottomBar}>Setting</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    return <Text>Loading...</Text>;
  }
};

const styles = StyleSheet.create({
  tabBarContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 10,
    borderTopWidth: 2,
    borderTopColor: "#ddd",
    height: 60,
  },

  tabBarItem: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 15
  },
  tittleBottomBar: {
    fontSize: 12,
    color: "#005E6A",
  },
});

export default BottomBarPage;