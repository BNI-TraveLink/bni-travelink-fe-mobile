import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Dimensions,
} from "react-native";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import { Ionicons } from "@expo/vector-icons";
import Confirmation from "../components/Confirmation";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";
// import { API_URL } from "@env";

const window = Dimensions.get("window");
const windowWidth = window.width;
const windowHeight = window.height;

let dataUsedToReorder = [];



const KrlOrderForm = () => {
  const [stations, setStations] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState(0);
  const [loginResponse, setLoginResponse] = useState([]);
  const [userId, setUserId] = useState("");

  const [selectedStation1, setSelectedStation1] = useState(null);
  const [selectedStation2, setSelectedStation2] = useState(null);
  const [selectedPeople, setSelectedPeople] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  const setDefault = () => {
    setSelectedStation1(null);
    setSelectedStation2(null);
    setSelectedPeople(null);
    dataUsedToReorder = [];
  }
  const navigation = useNavigation();

  const handleBackPress = () => {
    setDefault();
    navigation.navigate("TraveLink");
  };

  useEffect(() => {


    const getStations = async () => {
      try {
        const storedData = await AsyncStorage.getItem("travelinkData");
        const parsedData = JSON.parse(storedData);

        const sessionData = await AsyncStorage.getItem("session");
        const parsedSessionData = JSON.parse(sessionData);
        if (parsedData && parsedSessionData) {
          setStations(parsedData.stations);
          setServiceName(parsedData.service);
          setPrice(parsedData.price);

          setLoginResponse(parsedSessionData);
          setUserId(parsedSessionData.userId);
          console.log("login response", loginResponse.userId);
          console.log("userid", userId);

        } else {
          console.log("No stations found in AsyncStorage");
        }
      } catch (error) {
        console.log("Error retrieving stations:", error);
      }
    };

    const reorder = async () => {
      try {
        const reorderData = await AsyncStorage.getItem("reorder");
        const parsedReorderData = JSON.parse(reorderData);
        await AsyncStorage.removeItem("reorder");
        dataUsedToReorder = parsedReorderData;

        setSelectedStation1(dataUsedToReorder.departure);
        setSelectedStation2(dataUsedToReorder.destination);
        setSelectedPeople(dataUsedToReorder.amount);
      } catch (error) {
        console.log("Error while getting the reorder data: ", error);
      }
    }

    setDefault();
    getStations();
    reorder();
  }, []);

  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../fonts/Poppins/Poppins-Bold.ttf"),
    "Inter-Regular": require("../fonts/Inter/static/Inter-Regular.ttf"),
    "Poppins-SemiBold": require("../fonts/Poppins/Poppins-SemiBold.ttf"),
  });

  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  
  const handleExchange = () => {
    const tempStation = selectedStation1;
    setSelectedStation1(selectedStation2);
    setSelectedStation2(tempStation);
  };
  
  const people = [
    { label: "1 people", value: 1 },
    { label: "2 people", value: 2 },
    { label: "3 people", value: 3 },
    { label: "4 people", value: 4 },
    { label: "5 people", value: 5 },
  ];

  const handleFormSubmit = () => {
    if (selectedStation1 && selectedStation2 && selectedPeople) {
      if (selectedStation1 !== selectedStation2) {
        setIsConfirmationVisible(true);
      } else {
        setIsConfirmationVisible(false);
        alert("Departure and destination stations should be different.");
      }
    } else {
      setIsConfirmationVisible(false);
    }
  };

  useEffect(() => {
    handleFormSubmit();
  }, [selectedStation1, selectedStation2, selectedPeople]);

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
            
            <Text style={styles.logoText}>{serviceName}</Text>
          </View>
        </View>
        <View style={{ paddingLeft: 10, paddingRight: 10, height: 390 }}>
          <View>
            <View style={styles.menuContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={require("../images/kai-commuter-logo.png")}
                  style={[styles.kaiLogo, { marginLeft: 133 }]}
                />
                
                <TouchableOpacity style={styles.buttonMaps} onPress={openModal}>
                  <Image
                    source={require("../images/maps-item.png")}
                    style={{ height: 14, width: 16}}
                  />
                  <Text style={styles.buttonTextMaps}>View Rute</Text>
                </TouchableOpacity>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => setModalVisible(false)}
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                      >
                        <Ionicons name="close" size={20} color="#005E6A"/>
                      </TouchableOpacity>
                      <Image
                        source={require("../images/rute-item.png")}
                        style={{ height: 430, width: 300 }}
                      />
                    </View>
                  </View>
                </Modal>
              </View>
              <View style={[styles.contentContainer, { paddingBottom: 20 }]}>
                <Text style={styles.textContainer}>From</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={require("../images/trainRight-item.png")}
                    style={{ height: 40, width: 40, marginTop: 15 }}
                  />
                  {stations && (
                    <Dropdown
                      placeholderStyle={selectedStation1 ? styles.selectedTextStyle : styles.textSelectStation}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={stations}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      searchPlaceholder="Search..."
                      value={selectedStation1}
                      onChange={(item) => {
                        setSelectedStation1(item.value);
                      }}
                      onChangeText={(item) => {
                        setSelectedStation1(item.value);
                      }}
                      placeholder={selectedStation1 ? selectedStation1 : "Select Departure Station"}
                      style={styles.placeholderStyle}
                    />
                  )}
                </View>
              </View>
              <View>
                <TouchableOpacity onPress={handleExchange}>
                  <Image
                    source={require("../images/exchange-line-item.png")}
                    style={{
                      height: 40,
                      width: 40,
                      marginTop: -20,
                      marginLeft: 320,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.contentContainer}>
                <Text style={[styles.textContainer, { marginTop: -10 }]}>
                  To
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={require("../images/trainRight-item.png")}
                    style={{ height: 40, width: 40, marginTop: 15 }}
                  />
                  {stations && (
                    <Dropdown
                      placeholderStyle={selectedStation2 ? styles.selectedTextStyle : styles.textSelectStation}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={stations}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      searchPlaceholder="Search..."
                      value={selectedStation2}
                      onChange={(item) => {
                        setSelectedStation2(item.value);
                      }}
                      onChangeText={(item) => {
                        setSelectedStation2(item.value);
                      }}
                      placeholder={selectedStation2 ? selectedStation2 : "Select Departure Station"}
                      style={styles.placeholderStyle}
                    />
                  )}
                </View>
              </View>
              <View style={styles.contentContainer}>
                <Text style={styles.textContainer}>Passenger</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={require("../images/people-item.png")}
                    style={{ height: 40, width: 40, marginTop: 15 }}
                  />
                  <Dropdown
                    placeholderStyle={selectedPeople ? styles.selectedTextStyle : styles.textSelectStation}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={people}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    searchPlaceholder="Search..."
                    value={selectedPeople}
                    onChange={(item) => {
                      setSelectedPeople(item.value);
                    }}
                    onChangeText={(item) => {
                      setSelectedPeople(item.value);
                    }}
                    placeholder="Max 5 People"
                    style={styles.placeholderStyle}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
        <Confirmation
            // set order from krl
            isVisibleConfirm={isConfirmationVisible}
            selectedStation1={selectedStation1}
            selectedStation2={selectedStation2}
            selectedPeople={selectedPeople}
            price={price}
          />
        {/* <BottomBarOrderForm /> */}
      </ImageBackground>
    );
  } else {
    return <Text>Loading...</Text>;
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
    borderBottomWidth: 2,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },

  centerContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginRight: 35,
  },

  logoText: {
    color: "white",
    fontSize: 22,
    fontFamily: "Inter-SemiBold",
  },

  menuContainer: {
    justifyContent: "center",
    marginTop: 20,
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

  kaiLogo: {
    width: 110,
    height: 40,
    marginTop: 20,
  },

  //container di bawah KAI
  contentContainer: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    paddingLeft: 20,
  },

  // text untuk from to passenger
  textContainer: {
    color: "#005E6A",
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    marginBottom: -15,
    marginTop: 10,
  },

  placeholderStyle: {
    borderBottomWidth: 1,
    borderColor: "#ADADAD",
    paddingVertical: 5,
    marginLeft: 10,
    width: 255,
  },

  textSelectStation: {
    fontSize: 14,
    color: "#797979",
    fontFamily: "Inter-Regular",
    marginLeft: 5,
    marginBottom: -20,
  },

  selectedTextStyle: {
    fontSize: 16,
    color: "#005E6A",
    fontFamily: "Poppins-SemiBold",
    marginBottom: -20,
  },

  iconStyle: {
    width: 20,
    height: 20,
  },

  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },

  buttonMaps: {
    borderRadius: 20,
    borderWidth: 0.5,
    padding: 8,
    backgroundColor: "white",
    borderColor: "#00A2B7",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    fontFamily: "Poppins-SemiBold",
    marginLeft: 25,
  },

  buttonTextMaps: {
    color: "#00A2B7",
    fontSize: 10,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    marginLeft: 8,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
  },

  closeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    padding: 0,
  },

  closeButtonText: {
    fontSize: 18,
  },
});

export default KrlOrderForm;