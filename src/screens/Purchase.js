import React from "react";
import { View, ImageBackground, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import GridHomeMenu from "../components/GridHomeMenu";
import { useNavigation } from "@react-navigation/native";

const Purchase = () => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.navigate("Home");
  };

  const handleTraveLinkPress = () => {
    navigation.navigate("TraveLink");
  };

  const [fontsLoaded] = useFonts({
    "Inter-Medium": require("../fonts/Inter/static/Inter-Medium.ttf"),
    "Inter-SemiBold": require("../fonts/Inter/static/Inter-SemiBold.ttf"),
  });

  if (fontsLoaded) {
    return (
      <ImageBackground
        source={require("../images/background-setengah.png")}
        style={styles.backgroundGradient}
      >
        <View style={styles.appBar}>
          <TouchableOpacity onPress={handleBackPress}>
            <Image
              source={require("../images/arrow-back-item.png")}
              style={{ height: 30, width: 30 }}
            />
          </TouchableOpacity>
          <View style={styles.centerContent}>
            <Text style={styles.logoText}>Purchase</Text>
          </View>
        </View>
        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
          <View>
            <View style={styles.menuContainer}>
              <View style={[styles.gridContainer, { paddingTop: 28 }]}>
                <GridHomeMenu
                  imageSource={require("../images/internet-item.png")}
                  labelText={"Internet"}
                />
                <GridHomeMenu
                  imageSource={require("../images/pln-item.png")}
                  labelText={"PLN"}
                />
                <GridHomeMenu
                  imageSource={require("../images/pgn-item.png")}
                  labelText={"PGN"}
                />
                <GridHomeMenu
                  imageSource={require("../images/tv-item.png")}
                  labelText={"TV"}
                />
              </View>
              <View style={[styles.gridContainer, { paddingBottom: 40 }]}>
                <GridHomeMenu
                  imageSource={require("../images/flight-item.png")}
                  labelText={"Flight"}
                />
                <GridHomeMenu
                  imageSource={require("../images/phone-item.png")}
                  labelText={"Phone"}
                />
                <GridHomeMenu
                  imageSource={require("../images/bnilife-item.png")}
                  labelText={"BNI Life"}
                />
                <TouchableOpacity onPress={handleTraveLinkPress}>
                <GridHomeMenu
                  imageSource={require("../images/traveLink-item.png")}
                  labelText={"BNI TraveLink"}
                />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
};

const styles = StyleSheet.create({
  backgroundGradient: {
    paddingTop: 30,
    height: 77,
  },

  appBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
    // backgroundColor: 'white',
    borderBottomWidth: 2,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    // elevation: 2,
  },

  centerContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    paddingRight: 35, // mengatur logo BNI ketengah
  },

  logoText: {
    color: "white",
    fontSize: 22,
    fontFamily: "Inter-SemiBold",
  },

  menuContainer: {
    justifyContent: "center",
    marginTop: 17,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  gridContainer: {
    marginLeft: 21,
    marginRight: 21,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default Purchase;
