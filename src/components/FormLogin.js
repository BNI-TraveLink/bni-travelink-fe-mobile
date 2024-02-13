import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import {API_URL} from "@env";


// import Constants from 'expo-constants';

import Constants from "expo-constants";
const apiUrl = Constants.manifest.extra.API_URL;  
// const apiUrl = process.env.EXPO_PUBLIC_API_URL;  

const FormLogin = ({ modalVisible, setModalVisible }) => {
  const [user_id, setUser_id] = useState("");
  const [mpin, setMpin] = useState("");
  const [showMpin, setShowMpin] = useState(false);
  const [rememberUser, setRememberUser] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorText, setErrorText] = useState(""); // Tambahkan state errorText
  const [isBtLinkPressed, setIsBtLinkPressed] = useState("");

  const [fontsLoaded] = useFonts({
    InterRegular: require("../fonts/Inter/static/Inter-Regular.ttf"),
    InterMedium: require("../fonts/Inter/static/Inter-Medium.ttf"),
  });

  const navigation = useNavigation(); // Inisialisasi objek navigasi

 
  const getData = async () => {
 
    try {
      const balanceSessionData = await AsyncStorage.getItem("btlink");
      const parsedBalanceData = JSON.parse(balanceSessionData);
      setIsBtLinkPressed(parsedBalanceData.toString());
      
    } catch (error) {
      console.log("Error fetching data: " + error);
    }
  };
  useEffect(() => {
    const loadData = async () => {
      await getData();
    };

  // Call getUserData when the component mounts
  loadData();
}, []);

  const handleLogin = async () => {
    console.log("login");
    setUser_id("");
    setMpin("");
    setErrorText("");

    const isMpinValid = mpin.length >= 6 && /^\d+$/.test(mpin);
    

    // if (user_id === hardcodedUser_id && isMpinValid && mpin === hardcodedMpin) {
    if (isMpinValid) {
      try {
        setIsLoggedIn(true);
        setModalVisible(false);

        const formData = new FormData();
        formData.append("userId", user_id);
        formData.append("mpin", mpin);
        
        console.log("apiurl",apiUrl);
        const responseLogin = await axios.post(`${apiUrl}/logins/hash`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        })
        console.log("RESPONSE LOGINNN: " + responseLogin);

        if (responseLogin.data) {
          await AsyncStorage.setItem("session", JSON.stringify(responseLogin.data));

          console.log("Bearer token to get response balance: " + responseLogin.data.jwt)
          const responseBalance = await axios.get(
            `${apiUrl}/balance/getBalanceByUserId/${responseLogin.data.userId}`, {
              headers: {
                Authorization: `Bearer ${responseLogin.data.jwt}`,
              }
            }
          );

          await AsyncStorage.setItem("balance", JSON.stringify(responseBalance.data));

          // get last ticket transaction of the user
          const userTicketsTransaction = await axios.get(
            `${apiUrl}/transaction/userId/${responseLogin.data.userId}`, {
              headers: {
                Authorization: `Bearer ${responseLogin.data.jwt}`,
              }
            }
          );
          
          // const historiesTransaction = userTicketsTransaction.data.length <= 9 ? userTicketsTransaction.data : userTicketsTransaction.data.slice(-10);
          // console.log("login user tickets transaction",userTicketsTransaction)
          const historiesTransaction = userTicketsTransaction.data;
          if(historiesTransaction.length > 0){
            const lastTicketTransaction = userTicketsTransaction.data[userTicketsTransaction.data.length - 1];
            await AsyncStorage.setItem("historiesTransaction", JSON.stringify(historiesTransaction));
            await AsyncStorage.setItem("lastTicketTransaction", JSON.stringify(lastTicketTransaction))
            console.log("lastiticket transaction data", lastTicketTransaction.service.name);


            const dataToSave = {
              service: lastTicketTransaction.service.name,
              stations: null, // Use the updated stations
              price: null
               };
      
            await AsyncStorage.setItem('travelinkData', JSON.stringify(dataToSave));

          }
         

          // Navigasi ke halaman Home setelah login berhasil
          // console.log("isbtlinkpressed",isBtLinkPressed);
          if(isBtLinkPressed === "true"){
            // console.log("ke btlink");
            navigation.navigate("TraveLink");
          }else{
            // console.log("ke home");
            navigation.navigate("Home");
          }
         
        }
      }catch (error) {
        console.log(error);
        setModalVisible(true); // Open the modal if there's an error
        setIsLoggedIn(false);
        setErrorText("User ID or MPIN is Incorrect");
      }

    } else {
      console.log("Login failed. Check your User ID and MPIN.");
      setModalVisible(true); // Open the modal if there's an error
      setIsLoggedIn(false);
      setErrorText("User ID or MPIN is Incorrect");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Tambahan: Reset state jika diperlukan
    setUser_id("");
    setMpin("");
    setErrorText("");
  };

  const toggleShowMpin = () => {
    setShowMpin(!showMpin);
  };

  const toggleRememberUser = () => {
    setRememberUser(!rememberUser);
  };

  if (fontsLoaded) {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {!isLoggedIn ? (
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
            ></TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleLogout}>
              <Text
                style={[styles.openModalText, { fontFamily: "InterRegular" }]}
              >
                Log Out
              </Text>
            </TouchableOpacity>
          )}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View
                style={[
                  styles.modalContent,
                  { width: 331, height: 415 },
                  {
                    marginTop: 217,
                    marginBottom: 212,
                    marginRight: 29,
                    marginLeft: 30,
                  },
                ]}
              >
                <Text style={[styles.title, { fontFamily: "InterRegular" }]}>
                  Welcome!
                </Text>
                {errorText ? (
                  <Text style={styles.errorText}>{errorText}</Text>
                ) : null}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>User ID</Text>
                  <TextInput
                    style={[
                      styles.input,
                      { color: "#005E6A", fontSize: 17, fontWeight: "600" },
                    ]}
                    placeholder="Enter your User ID"
                    value={user_id}
                    autoFocus={true}
                    onChangeText={(text) => setUser_id(text)}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>MPIN</Text>
                  <View style={styles.mpinInputContainer}>
                    <TextInput
                      style={[
                        styles.input,
                        { color: "#005E6A", fontSize: 17, fontWeight: "600" },
                      ]}
                      placeholder="Enter your MPIN"
                      secureTextEntry={!showMpin}
                      value={mpin}
                      autoFocus={false}
                      onChangeText={(text) => setMpin(text)}
                    />
                    <TouchableOpacity
                      style={[
                        styles.showMpinToggle,
                        {
                          marginTop: -8,
                        },
                      ]}
                      onPress={toggleShowMpin}
                    >
                      <Ionicons
                        name={showMpin ? "eye-off" : "eye"}
                        size={24}
                        color="#00A2B7"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={toggleRememberUser}
                  >
                    <Ionicons
                      name={rememberUser ? "checkbox" : "checkbox-outline"}
                      size={19}
                      color="#005E6A"
                    />
                    <Text
                      style={[
                        styles.checkboxLabel,
                        { fontFamily: "InterMedium" },
                      ]}
                    >
                      Save User ID
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    handleLogin();
                    if (isLoggedIn) {
                      setModalVisible(false);
                    }
                  }}
                >
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeModalButton}
                  onPress={() => {
                    setModalVisible(false);
                    setErrorText(""); // Reset pesan kesalahan saat menutup modal
                  }}
                >
                  <Ionicons name="close" size={24} color="#005E6A" />
                </TouchableOpacity>
                <View style={styles.forgotContainer}>
                  <TouchableOpacity
                    onPress={() => console.log("Forgot User ID?")}
                  >
                    <Text style={styles.forgotText}>Forgot User ID?</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => console.log("Forgot MPIN?")}>
                    <Text style={styles.forgotText}>Forgot MPIN?</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          {isLoggedIn ? (
            <View style={styles.container}>
              <Text>Welcome, User!</Text>
            </View>
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    );
  } else {
    return <View></View>;
  }
};
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    marginHorizontal: 14,
    backgroundColor: "#FFF",
    borderRadius: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#005E6A",
    fontFamily: "InterRegular",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 8,
    overflow: "hidden",
    // Set the background color to gray
    paddingHorizontal: 10, // Add padding to align text with the input
  },
  label: {
    paddingHorizontal: 10,
    fontSize: 17,
    alignSelf: "flex-start",
    marginBottom: 5,
    color: "#F15A23",
  },
  input: {
    height: 50,
    paddingHorizontal: 10,
    borderRadius: 20,
    width: "100%",
    shadowColor: "#000", // Warna bayangan
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5, // Kekuatan bayangan (0-1)
    shadowRadius: 3.84, // Jarak bayangan dari elemen
    elevation: 2, // Elevation memberikan efek bayangan pada Android
    backgroundColor: "#D9D9D9", // Warna latar belakang sesuai kebutuhan
    padding: 14, // Atur padding sesuai kebutuhan
    marginBottom: 10, // Atur margin bawah sesuai kebutuhan
  },
  mpinInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#DDD",
  },
  showMpinToggle: {
    marginLeft: "auto",
    paddingRight: 10,
  },
  button: {
    backgroundColor: "#F15A23",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginHorizontal: 70,
    marginTop: 18,
    marginBottom: 30,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  closeModalButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  checkboxContainer: {
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  checkbox: {
    marginTop: -10,
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxLabel: {
    marginLeft: 10,
    color: "#005E6A",
    fontSize: 13,
  },
  forgotContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  forgotText: {
    color: "#005E6A",
    fontSize: 12,
  },
  errorText: {
    paddingHorizontal: 12,
    color: "red",
    marginBottom: 10,
  },
});

export default FormLogin;
