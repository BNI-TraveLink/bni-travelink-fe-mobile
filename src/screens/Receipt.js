import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import {API_URL} from "@env";
import axios from "axios";

import Constants from "expo-constants";
const apiUrl = Constants.manifest.extra.API_URL;

const fontTheme = {
  regular: "Inter-Regular",
  medium: "Inter-Medium",
  semiBold: "Inter-SemiBold",
};
const Receipt = () => {
  const [fontsLoaded] = useFonts({
    [fontTheme.regular]: require("../fonts/Inter/static/Inter-Regular.ttf"),
    [fontTheme.medium]: require("../fonts/Inter/static/Inter-Medium.ttf"),
  });

  const navigation = useNavigation();

  const [saldo, setSaldo] = useState(0);
  const [userData, setUserData] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [serviceName, setServiceName] = useState("");
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [user_id, setUser_id] = useState("");
  const [requestData, setRequestData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [state, setState] = useState(null);
  const [amount,setAmount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [transaction,setTransaction] = useState(null);
  const [datePart, setDatePart] = useState('');
  const [timePart, setTimePart] = useState('');

  let createdAtDate ;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const getUserData = async () => {
          // 1. Get the balance first
        const balanceSessionData = await AsyncStorage.getItem("balance");
        const parsedBalanceData = JSON.parse(balanceSessionData);
        setSaldo(parsedBalanceData.toString());

        // 2. Then, get the session data
        const sessionData = await AsyncStorage.getItem("session");
        const parsedSessionData = JSON.parse(sessionData);
        setUserData(parsedSessionData);
        setUser_id(parsedSessionData.userId);

        const serviceData = await AsyncStorage.getItem("travelinkData");
        const parsedServiceData = JSON.parse(serviceData);
        setServiceName(parsedServiceData.service);

        const departureData = await AsyncStorage.getItem("departure");
        const parsedDepartureData = JSON.parse(departureData);
        setDeparture(parsedDepartureData);

        const destinationData = await AsyncStorage.getItem("destination");
        const parsedDestinationData = JSON.parse(destinationData);
        setDestination(parsedDestinationData);

        const amountData = await AsyncStorage.getItem("amount");
        const parsedAmountData = JSON.parse(amountData);
        setAmount(parsedAmountData);

        const totalPriceData = await AsyncStorage.getItem("totalPrice");
        const parsedTotalPricedData = JSON.parse(totalPriceData);
        setTotalPrice(parsedTotalPricedData);

        const orderIdData = await AsyncStorage.getItem("orderId");
        const parsedOrderIdData = JSON.parse(orderIdData);
        setOrderId(parsedOrderIdData, parsedSessionData.jwt);

        console.log("receipt.js parsedOrderdData");
        await getTransaction(parsedOrderIdData, parsedSessionData.jwt, parsedSessionData.userId);
        };
  
        const getTransaction = async (orderId, jwtToken, userId) => {
          try {
            console.log("orderID",orderId);
            console.log("jwtToken in Receipt: " + jwtToken);
            const transaction = await axios.get(
              `${apiUrl}/transaction/orderId/${orderId}`, {
                headers: {
                  Authorization: `Bearer ${jwtToken}`,
                }
              }
            );
            setTransaction(transaction.data.data  );
            console.log("transaction",transaction);
            console.log("transaction",transaction.data);
            console.log("date",transaction.data.createdAt);
            await AsyncStorage.setItem("transaction", JSON.stringify( transaction.data));
           
            createdAtDate = new Date(transaction.data.createdAt);
            const newDatePart = createdAtDate.toISOString().split('T')[0];
            const newTimePart = createdAtDate.toLocaleTimeString('id-ID', {
              hour12: false, // Use 24-hour format
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            });
            setDatePart(newDatePart);
            setTimePart(newTimePart);
          
            console.log("Date:", newDatePart);
            console.log("Time:", newTimePart);

            console.log("jwtToken in Receipt for userTicketsTransaction: " + jwtToken);
            console.log(`Data sent to BE: ${apiUrl}/transaction/userId/${userId}`);
            const userTicketsTransaction = await axios.get(
              `${apiUrl}/transaction/userId/${userId}`, {
                headers: {
                  Authorization: `Bearer ${jwtToken}`,
                }
              }
            );
            console.log("userTicketsTransaction: " + userTicketsTransaction);
            console.log("DATA: " + userTicketsTransaction.data);
            const historiesTransaction = userTicketsTransaction.data;
            await AsyncStorage.setItem("historiesTransaction", JSON.stringify(historiesTransaction));
            
          } catch (error) {
            console.log("Error fetching transaction in Receipt: " + error);
          }
        };
  
        // Call getUserData to initiate data retrieval
        await getUserData();
      } catch (error) {
        console.log("Error fetching data: " + error);
      }
    };
  
    fetchData();
  }, []);
  

 


  if (!fontsLoaded) {
    // You can return an empty View or null for now, as we are only interested in the app bar
    return null;
  }

  const handleTicketDetails = () => {
    // Handle logic when the Pay button is pressed
    // For now, let's navigate to a new page named "PaymentSuccess"
    navigation.navigate("TicketDetails");
  };
  const handleHome = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      {/* App Bar Image */}
      <Image
        source={require("../images/bar_purchase.png")}
        style={styles.PurchaseImage}
      />

      {/* App Bar */}
      <View style={styles.appBarContainer}>
        {/* Title (Purchase) */}
        <Text style={styles.title}>Status</Text>
        <TouchableOpacity onPress={handleHome}>
          {/* Left Icon (Back Arrow) */}
          <Image
            source={require("../images/ic_round-home.png")}
            style={styles.homeImage}
          />
        </TouchableOpacity>
      </View>

      {/* Image in the middle below App Bar */}
      <View style={styles.centeredImageContainer}>
        <Image
          source={require("../images/box-fitur-utama.png")}
          style={styles.boxfiturImage}
        />

        <Image
          source={require("../images/clarity_success-standard-solid.png")}
          style={styles.successImage}
        />
        <Text style={styles.transactionsuccessText}>
          Transaction Successful
        </Text>
        <View style={styles.paymentContainer}>
          <View style={styles.paymentConfirmationRow}>
            <Text style={styles.paymentConfirmationLabel}>Type of Service</Text>
            <Text
              style={[
                styles.paymentConfirmationValue,
                styles.rightAlign,
                styles.interSemiBold,
                { maxWidth: 200 },
              ]}
            >
              {serviceName}
            </Text>
          </View>
          <View style={styles.paymentConfirmationRow}>
            <Text style={styles.paymentConfirmationLabel}>Order ID</Text>
            <Text
              style={[
                styles.paymentConfirmationValue,
                styles.rightAlign,
                styles.interSemiBold,
              ]}
            >
              000{orderId}
            </Text>
          </View>
          <View style={styles.paymentConfirmationRow}>
            <Text style={styles.paymentConfirmationLabel}>Journal ID</Text>
            <Text
              style={[
                styles.paymentConfirmationValue,
                styles.rightAlign,
                styles.interSemiBold,
              ]}
            >
              930081
            </Text>
          </View>
          <View style={styles.paymentConfirmationRow}>
            <Text style={styles.paymentConfirmationLabel}>
              Transaction Date
            </Text>
            <Text
              style={[
                styles.paymentConfirmationValue,
                styles.rightAlign,
                styles.interSemiBold,
              ]}
            >
              {datePart}
            </Text>
          </View>
          <View style={styles.paymentConfirmationRow}>
            <Text style={styles.paymentConfirmationLabel}>
              Transaction Time
            </Text>
            <Text
              style={[
                styles.paymentConfirmationValue,
                styles.rightAlign,
                styles.interSemiBold,
              ]}
            >
              {timePart} WIB
            </Text>
          </View>
          <View style={styles.paymentConfirmationRow}>
            <Text style={styles.paymentConfirmationLabel}>Account</Text>
            <Text
              style={[
                styles.paymentConfirmationValue,
                styles.rightAlign,
                styles.interSemiBold,
              ]}
            >
              {userData.accountNumber}
            </Text>
          </View>
          <View style={styles.paymentConfirmationRow}>
            <Text style={styles.paymentConfirmationLabel}>Price</Text>
            <Text
              style={[
                styles.paymentConfirmationValue,
                styles.rightAlign,
                styles.interSemiBold,
              ]}
            >
              Rp {Number(totalPrice).toLocaleString('id-ID')}
            </Text>
          </View>
          <View style={styles.paymentConfirmationRow}>
            <Text style={styles.paymentConfirmationLabel}>Admin Fee</Text>
            <Text
              style={[
                styles.paymentConfirmationValue,
                styles.rightAlign,
                styles.interSemiBold,
              ]}
            >
              0
            </Text>
          </View>
          <View style={styles.paymentConfirmationRow}>
            <View style={styles.blueOverlay}></View>
            <Text style={styles.paymentConfirmationLabel2}>Total Payment</Text>

            <Text
              style={[
                styles.paymentConfirmationValue,
                styles.rightAlign,
                styles.interSemiBold,
              ]}
            >
              Rp {Number(totalPrice).toLocaleString('id-ID')}
            </Text>
          </View>
        </View>
        {/* Additional Image */}
      </View>

      {/* White background at the bottom with a button */}
      <View style={styles.bottomWhiteBackground}>
        <View style={styles.buttonContainerRow}>
          <TouchableOpacity style={styles.buttonContainer}>
            <Text style={styles.downloadText}>Download</Text>
            <Image
              source={require("../images/material-symbols_download.png")}
              style={styles.downloadImage}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer}>
            <Text style={styles.shareText}>Share</Text>
            <Image
              source={require("../images/material-symbols_share.png")}
              style={styles.shareImage}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.buttonbottomContainer}
          onPress={handleTicketDetails} // Menambahkan onPress event untuk menangani pembayaran
        >
          <Text style={styles.buttonbottomText}>Ticket Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  PurchaseImage: {
    width: "100%",
    height: 88,
    resizeMode: "cover",
  },
  appBarContainer: {
    position: "absolute",
    top: 55,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  backArrow: {
    position: "absolute",
    left: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: fontTheme.semiBold,
    // marginRight: 20,
    marginLeft: 150,
  },
  centeredImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  rightAlign: {
    textAlign: "right",
  },
  interSemiBold: {
    fontFamily: fontTheme.semiBold,
  },
  interRegular: {
    fontFamily: fontTheme.regular,
  },

  icon: {
    marginLeft: 5,
    marginBottom: 14,
  },

  bottomWhiteBackground: {
    width: 390,
    height: 147,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",

    alignItems: "center",
  },
  buttonbottomContainer: {
    width: 362,
    height: 49,
    backgroundColor: "#F15A23", // Adjust the color as needed
    paddingVertical: 10,
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
  },
  buttonbottomText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
    paddingHorizontal: 103,
    top: 4,
    fontWeight: "bold",
  },
  homeImage: {
    // position: "absolute",
    marginTop: -5,
    marginLeft: 120,
    width: 30,
    height: 30,
  },
  boxfiturImage: {
    marginTop: 428,
    marginBottom: 50,
    marginLeft: 15,
    marginRight: 15,
    paddingHorizontal: 31,
    width: 362,
    height: 545,
  },
  successImage: {
    position: "absolute",
    width: 70,
    height: 70,
    // marginBottom: 200,
    top: 45,
  },
  transactionsuccessText: {
    position: "absolute",
    color: "#005E6A",
    fontSize: 16,
    fontWeight: "600",
    top: 120,
  },
  paymentConfirmationRow: {
    // position: "absolute",

    paddingTop: 13,
    bottom: 462,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
  },
  paymentConfirmationLabel: {
    // position: "absolute",
    marginLeft: 120,
    right: 100,
    fontSize: 14,
    textAlign: "left",
    color: "#005E6A",
    paddingHorizontal: 17,
    fontWeight: "500",
  },
  paymentConfirmationLabel2: {
    marginLeft: 120,
    right: 100,
    fontSize: 14,
    textAlign: "left",
    color: "#005E6A",
    paddingHorizontal: 17,
    fontWeight: "600",
    // fontFamily: "Inter-SemiBold",
  },
  paymentConfirmationValue: {
    // position: "absolute",
    marginRight: 40,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "600",
    // fontFamily: "Inter-SemiBold",
  },
  buttonContainerRow: {
    flexDirection: "row",
    // justifyContent: "space-between",
    // width: "100%",
    marginBottom: 20,
    left: -8,
    // paddingHorizontal: 10,
  },
  buttonContainer: {
    width: 173,
    height: 40,
    // width: 362,
    // height: 49,
    backgroundColor: "#FFFFFF", // Adjust the color as needed
    borderColor: "#FE7624", // Border color (blue)
    borderWidth: 2, // Border width
    paddingVertical: 10,
    // paddingHorizontal: 20,
    borderRadius: 20,
    marginLeft: 15,
  },
  downloadText: {
    color: "#F15A23",
    fontSize: 16,
    marginLeft: 60,
  },
  shareText: {
    color: "#F15A23",
    fontSize: 16,
    marginLeft: 70,
  },
  downloadImage: {
    width: 30,
    height: 30,
    bottom: 23,
    left: 10,
  },
  shareImage: {
    width: 25,
    height: 25,
    bottom: 21,
    left: 10,
  },
  blueOverlay: {
    width: 304,
    height: 23,
    position: "absolute",
    backgroundColor: "rgba(197, 229, 235, 1)", // Adjust the color and opacity as needed
    top: 10,
    bottom: 0,
    left: 35,
    right: 0,
    borderRadius: 0,
  },
});

export default Receipt;
