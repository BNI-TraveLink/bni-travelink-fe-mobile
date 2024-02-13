import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
} from "react-native";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from 'moment';

// import {API_URL} from "@env";

const Confirmation = ({
  isVisibleConfirm,
  selectedStation1,
  selectedStation2,
  selectedPeople,
  price,
}) => {
  const navigation = useNavigation();
  const [errorText, setErrorText] = useState("");

  const [saldo, setSaldo] = useState(0);
  const [userData, setUserData] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [serviceName, setServiceName] = useState("");
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [amount,setAmount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const getUserData = async () => {
      try {
        // 1. Get the balance first
        const balanceSessionData = await AsyncStorage.getItem("balance");
        const parsedBalanceData = JSON.parse(balanceSessionData);
        setSaldo(parsedBalanceData.toString());

        // 2. Then, get the session data
        const sessionData = await AsyncStorage.getItem("session");
        const parsedSessionData = JSON.parse(sessionData);
        setUserData(parsedSessionData);

        const serviceData = await AsyncStorage.getItem("travelinkData");
        const parsedServiceData = JSON.parse(serviceData);
        setServiceName(parsedServiceData.service);

      } catch (error) {
        console.log("Error fetching data: " + error);
      }
    };

    getUserData();
  }, []);

  const [fontsLoaded] = useFonts({
    "Poppins-SemiBold": require("../fonts/Poppins/Poppins-SemiBold.ttf"),
    "Poppins-Medium": require("../fonts/Poppins/Poppins-Medium.ttf"),
    "Inter-Light": require("../fonts/Inter/static/Inter-Light.ttf"),
    "Poppins-ExtraBold": require("../fonts/Poppins/Poppins-ExtraBold.ttf"),
    "Inter-Regular": require("../fonts/Inter/static/Inter-Regular.ttf"),
    "Inter-Bold": require("../fonts/Inter/static/Inter-Bold.ttf"),
  });


  const generatePayment = async () => {
    try {

      await AsyncStorage.setItem("serviceName", JSON.stringify( serviceName));
      await AsyncStorage.setItem("departure", JSON.stringify( selectedStation1));
      await AsyncStorage.setItem("destination", JSON.stringify( selectedStation2));
      await AsyncStorage.setItem("amount", JSON.stringify( selectedPeople));
      await AsyncStorage.setItem("totalPrice", JSON.stringify( selectedPeople * price));


      // await AsyncStorage.setItem("paymentRequest", JSON.stringify(Array.from(formData.entries())));

    } catch (error) {
      // Handle errors here
      console.log('Error build Request :', error.message);
    }
  };


  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const [isHidden, setIsHidden] = useState(false);
  // const saldo = "2.971.946";

  const toggleVisibility = () => {
    setIsHidden(!isHidden);
  };

  const handlePay = async () => {
    try {
      // Generate and store payment details
      await generatePayment();

      // Fetch and update the stored values
      const serviceNameData = await AsyncStorage.getItem("serviceName");
      const departureData = await AsyncStorage.getItem("departure");
      const destinationData = await AsyncStorage.getItem("destination");
      const amountData = await AsyncStorage.getItem("amount");
      const totalPriceData = await AsyncStorage.getItem("totalPrice");

      // Update the state with the fetched values
      setServiceName(JSON.parse(serviceNameData));
      setDeparture(JSON.parse(departureData));
      setDestination(JSON.parse(destinationData));
      setAmount(JSON.parse(amountData));
      setTotalPrice(JSON.parse(totalPriceData));

      // Navigate to the "Validation" screen
      navigation.navigate("Validation");
    } catch (error) {
      console.log("Error handling payment:", error.message);
    }
  };

  if (fontsLoaded) {
    return (
      <View style={{ display: isVisibleConfirm ? "flex" : "none" }}>
        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
          <View style={styles.hijauContainer}>
            <Text style={styles.hijauText}>
              You wil get a QR code after payment
            </Text>
          </View>
          <View style={styles.menuContainer}>
            <View style={styles.contentContainer}>
              <Image
                source={require("../images/Group150.png")}
                style={styles.imageTravel}
              ></Image>
              <View>
                <Text style={styles.textDestination}>{selectedStation1}</Text>
                <Text style={[styles.textDestination, { marginTop: 40 }]}>
                  {selectedStation2}
                </Text>
                <Text style={styles.textValid}>
                  Valid until {moment().format('D MMM YYYY')}, 23:59
                </Text>
              </View>
              <Text style={styles.textPriceTicket}>Rp {Number(price).toLocaleString('id-ID')}</Text>
            </View>
          </View>
          <View style={styles.unguContainer}>
            <View style={styles.unguContent}>
              <Image
                source={require("../images/warning-purple-item.png")}
                style={{ height: 20, width: 20 }}
              ></Image>
              <Text style={[styles.unguText, { marginLeft: 5 }]}>
                I have read and agree to the{" "}
                <Text
                  style={[styles.textTC, { alignSelf: "baseline" }]}
                  onPress={openModal}
                >
                  terms and conditions
                </Text>{" "}
                of ticket purchase
              </Text>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles.TcContainer}>
                  <View
                    style={[
                      styles.TcContent,
                      { width: 331, height: 415 },
                      {
                        marginTop: 217,
                        marginBottom: 212,
                        marginRight: 29,
                        marginLeft: 30,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.closeModalButton}
                      onPress={() => {
                        setModalVisible(false);
                        setErrorText(""); // Reset pesan kesalahan saat menutup modal
                      }}
                    >
                      <Ionicons name="close" size={24} color="#005E6A" />
                    </TouchableOpacity>
                    <Text style={styles.titleTc}>Terms and conditions</Text>
                    <Text style={styles.infoTc}>
                      Commuter Line ticket orders via BNI TraveLink are
                      available for travel by Kereta Commuter Indonesia (KCI) or
                      Commuter Line
                    </Text>
                    <Text style={styles.infoTc}>
                      Users must have a BNI account to order tickets via BNI
                      TraveLink.
                    </Text>
                    <Text style={styles.infoTc}>
                      Commuter Line ticket users must comply with the applicable
                      regulations during the trip, including security rules and
                      regulations that have been established.
                    </Text>
                    <Text style={styles.infoTc}>
                      We have the right to cancel or refuse Commuter Line ticket
                      orders if there are indications of fraud or violation of
                      the terms and conditions specified.
                    </Text>
                    <Text style={styles.infoTc}>
                      Departure station and destination station cannot be
                      changed.
                    </Text>
                    <Text style={styles.infoTc}>
                      Tickets that have been ordered cannot be cancelled.
                    </Text>
                    <Text style={styles.infoTc}>
                      Commuter Line ticket users must exit at the destination
                      station they have booked, otherwise the QR code cannot be
                      used.
                    </Text>
                  </View>
                </View>
              </Modal>
            </View>
          </View>
        </View>
        <View style={styles.bottomWhiteBackground}>
          <View>
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                // marginBottom: 10,
                marginLeft: 5,
              }}
            >
              <Image
                source={require("../images/wallet-green-item.png")}
                style={{ height: 40, width: 40, marginLeft: 20 }}
              ></Image>
              <View style={{ marginLeft: 5 }}>
                <Text style={styles.textYourBalance}>Your Balance</Text>
                <View style={styles.saldoContainer}>
                  <Text style={styles.saldoLabel}>Rp </Text>
                  <Text style={[styles.saldoText, {fontSize: isHidden ? 7 : 14}]}>
                    {/* {isHidden ? "⬤⬤⬤⬤⬤⬤⬤⬤" : saldo} */}
                    {isHidden ? "⬤⬤⬤⬤⬤⬤⬤⬤" : parseFloat(saldo).toLocaleString('id-ID')}
                  </Text>
                  <TouchableOpacity onPress={toggleVisibility}>
                    <Image
                      source={
                        isHidden
                          ? require("../images/visible-grey.png")
                          : require("../images/not-visible-grey.png")
                      }
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <TouchableOpacity
                style={styles.buttomContainer}
                onPress={handlePay}
              >
                <Text style={styles.buttonText}>Pay</Text>
                <Text style={styles.pricePay}>Rp {Number(selectedPeople * price).toLocaleString('id-ID')}</Text>
                <Image
                  source={require("../images/next-item.png")}
                  style={{ height: 40, width: 40, marginLeft: 10 }}
                ></Image>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  } else {
    return <Text>Loading...</Text>;
  }
};

const styles = StyleSheet.create({
  hijauContainer: {
    backgroundColor: "#00A2B7",
    borderRadius: 20,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "left",
    zIndex: 2,
    marginTop: 15,
  },

  hijauText: {
    fontSize: 13,
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
    paddingLeft: 13,
    paddingRight: 13,
    paddingTop: 9,
    paddingBottom: 9,
  },

  menuContainer: {
    marginTop: -20,
    backgroundColor: "#E4EFF1",
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

  contentContainer: {
    flexDirection: "row",
    marginTop: 30,
    marginLeft: 20,
  },

  imageTravel: {
    height: 79,
    width: 20,
  },

  textDestination: {
    color: "#005E6A",
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    marginLeft: 10,
  },

  textValid: {
    color: "#F15A23",
    fontFamily: "Inter-Light",
    fontSize: 12,
    marginLeft: 10,
    marginBottom: 10,
  },

  textPriceTicket: {
    fontSize: 16,
    color: "#F15A23",
    fontFamily: "Poppins-Bold",
    // marginTop: 67,
    // marginLeft: 50,
    top: 67,
    right: 20,
    position: "absolute",
  },

  unguContainer: {
    marginTop: 15,
    backgroundColor: "#DECAF8",
    borderRadius: 20,
  },

  unguContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },

  unguText: {
    color: "#5D21D1",
    fontFamily: "Inter-Regular",
    fontSize: 11,
  },

  textTC: {
    fontSize: 11,
    color: "#5D21D1",
    fontFamily: "Inter-Bold",
  },

  TcContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  TcContent: {
    width: "80%",
    padding: 20,
    marginHorizontal: 14,
    backgroundColor: "#FFF",
    borderRadius: 20,
  },

  closeModalButton: {
    position: "absolute",
    color: "#00A2B7",
    top: 10,
    right: 10,
  },

  titleTc: {
    fontSize: 13,
    marginTop: 48,
    textAlign: "center",
    color: "#000000",
    fontFamily: "Poppins-Medium",
    marginBottom: 10,
  },

  infoTc: {
    fontSize: 10,
    marginTop: 5,
    textAlign: "justify",
    color: "#000000",
    fontFamily: "Inter-Regular",
    paddingLeft: 30,
    paddingRight: 30,
  },
  bottomWhiteBackground: {
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    borderTopColor: "#ddd",
    marginTop: 50,
  },

  textYourBalance: {
    fontSize: 12,
    color: "#696969",
    fontFamily: "Inter-Regular",
  },

  saldoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },

  saldoLabel: {
    color: "#005E6A",
    fontSize: 14,
    fontFamily: "Poppins-ExtraBold",
  },

  saldoText: {
    color: "#005E6A",
    fontFamily: "Poppins-ExtraBold",
    letterSpacing: 1, // mengatur agar tidak ada space
  },

  icon: {
    width: 20,
    height: 20,
    marginLeft: 6,
    // marginBottom: 6,
  },

  buttomContainer: {
    backgroundColor: "#F15A23",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
  },

  pricePay: {
    color: "#FFFFFF",
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginLeft: 160,
  },
});

export default Confirmation;
