import { useFonts } from "expo-font";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { View } from "react-native";
import GridHomeMenu from "../components/GridHomeMenu";
import { useNavigation } from "@react-navigation/native";
import HistoryTraveLink from "../components/HistoryTraveLink";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

// import {API_URL} from "@env";

import Constants from "expo-constants";
const apiUrl = Constants.manifest.extra.API_URL;

const window = Dimensions.get("window");
const windowWidth = window.width;
const windowHeight = window.height;

const TraveLink = () => {
  const navigation = useNavigation();
  const [stations, setStations] = useState([]);

  const [userData, setUserData] = useState("");

  useEffect(() => {
    const getUserData = async () => {
      try {
        const sessionData = await AsyncStorage.getItem("session");
        const parsedSessionData = JSON.parse(sessionData);
        setUserData(parsedSessionData);
      } catch (error) {
        console.log("Error fetching User Details: ", error);
      }
    };

    getUserData();
  }, []);

  const handleBackPress = () => {
    navigation.navigate("Purchase");
  };

  const handleCommuterPress = async () => {
    setStations([]);

    try {
      await getListStations("KRL");
     navigation.navigate("KrlOrderForm");
    } catch (error) {
      console.log('Error hitting the API:', error);
    }
  };

  const handleTiJePress = async () => {
    setStations([]);

    try {
      await getListStations("TJ");

     navigation.navigate("KrlOrderForm");
    } catch (error) {
      console.log('Error hitting the API:', error);
    }
  };

  const handleMrtPress = async () => {
    setStations([]);

    try {
      await getListStations("MRT");

      navigation.navigate("KrlOrderForm");
    } catch (error) {
      console.log("Error hitting the API:", error);
    }
  };

  const handleLrtPress = async () => {
    setStations([]);

    try {
      await getListStations("LRT");

      navigation.navigate("KrlOrderForm");
    } catch (error) {
      console.log('Error hitting the API:', error);
    }
  };

  const getListStations = async (travelinkService) => {
    await AsyncStorage.removeItem("reorder");
    const url = `${apiUrl}/service/getStationByServiceName`;

    try {
      const response = await axios.get(url, {
        params: {
          serviceName: travelinkService,
        },
        headers: {
          Authorization: `Bearer ${userData.jwt}`,
        },
      });

      const newStations = response.data.map((station) => ({
        label: station.station_name,
        value: station.station_name,
      }));

      setStations(newStations);

      const dataToSave = {
        service: travelinkService,
        stations: newStations, // Use the updated stations
        price: response.data[0].fkService.price
         };

      await AsyncStorage.setItem('travelinkData', JSON.stringify(dataToSave));
    } catch (error) {
      console.log('Error getting station data:', error);
      throw error; // Rethrow the error to be caught in handleMrtPress
    }
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
            <Text style={styles.logoText}>BNI TraveLink</Text>
          </View>
        </View>
        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
          <View>
            <View style={styles.menuContainer}>
              <View style={styles.gridContainer}>
                <TouchableOpacity onPress={handleCommuterPress}>
                  <GridHomeMenu
                    imageSource={require("../images/commuter-item.png")}
                    labelText={"Commuter"}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleTiJePress}>
                  <GridHomeMenu
                    imageSource={require("../images/tije-item.png")}
                    labelText={"TiJe"}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleMrtPress}>
                  <GridHomeMenu
                    imageSource={require("../images/mrt-item.png")}
                    labelText={"MRT"}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLrtPress}>
                  <GridHomeMenu
                    imageSource={require("../images/lrt-item.png")}
                    labelText={"LRT"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          <HistoryTraveLink />
        </View>
      </ImageBackground>
    );
  }
};

const styles = StyleSheet.create({
  backgroundGradient: {
    paddingTop: 30,
    flex: 1,
    height: windowHeight * 0.1,
  },

  appBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
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

export default TraveLink;
