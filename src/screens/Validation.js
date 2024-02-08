import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import {API_URL} from "@env";

import Constants from "expo-constants";
const apiUrl = Constants.manifest.extra.API_URL;

const fontTheme = {
  regular: "Inter-Regular",
  medium: "Inter-Medium",
  semiBold: "Inter-SemiBold",
};
const Validation = () => {
  const [fontsLoaded] = useFonts({
    [fontTheme.regular]: require("../fonts/Inter/static/Inter-Regular.ttf"),
    [fontTheme.medium]: require("../fonts/Inter/static/Inter-Medium.ttf"),
  });

  const [password, setPassword] = useState(""); // State untuk menyimpan kata sandi
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  // const orderID = "";
  let orderID = "";


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





      } catch (error) {
        console.log("Error fetching data: " + error);
      }
    };

    getUserData();
  }, []);

  if (!fontsLoaded) {
    // You can return an empty View or null for now, as we are only interested in the app bar
    return null;
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const handleTransactionPassword = async () => {
    try {

      setIsLoggedIn(true);
      const formData = new FormData();
      formData.append("userId", user_id);
      formData.append("transactionPassword", password);

      console.log("Sending request to server...");

      const responseLogin = await axios.post(
        `${apiUrl}/logins/TransactionPasswordHash`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("response status", responseLogin.status);
      console.log("response login", responseLogin);
      console.log("Response received from server:", responseLogin.data);

      if (responseLogin.status === 200 || responseLogin.status === 201) {

        await  generatePayment();
        await  updatePayment();
        await AsyncStorage.setItem("orderId", JSON.stringify( orderID));
        await generateTicket();

      navigation.navigate("Receipt");

        console.log(isLoggedIn);
        // await AsyncStorage.setItem("session", JSON.stringify(responseLogin.data));
        // hit generatepayment
      }
      else{
        Alert.alert(
          "Transaction Password",
          "Incorrect transaction password. Please try again.",
          [
            {
              text: "OK",
              onPress: () => console.log("OK Pressed"),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        "Transaction Password",
        "Incorrect transaction password. Please try again.",
        [
          {
            text: "OK",
            onPress: () => console.log("OK Pressed"),
          },
        ]
      );
     
      console.log("Error in handleTransactionPassword:", error);
    }
  };


  const generatePayment = async () => {
    try {

      const formData = new FormData();

      formData.append('userId', user_id);
      formData.append('serviceName', serviceName);
      formData.append('departure', departure);
      formData.append('destination', destination);
      formData.append('amount', amount);
      formData.append('totalPrice', totalPrice);
      console.log("formdata",formData);
      console.log("apiurl",apiUrl);

      // await AsyncStorage.setItem("paymentRequest", JSON.stringify(formData));

      const response = await axios.post(`${apiUrl}/payment/GeneratePayment`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });


      // setOrderId(response.data);
      orderID = response.data;
      console.log("generate payment order id",orderID);
    } catch (error) {

      console.error('API Error:', error.message);
    }
  };

  const updatePayment = async () => {
    try {
      console.log("order id buat update payment",orderID);          
      const formData = new FormData();

      formData.append('orderId', orderID);
      formData.append('userid', user_id);
      formData.append('val', ("-" + totalPrice.toString())) ;

      // await AsyncStorage.setItem("paymentRequest", JSON.stringify(formData));

      const response = await axios.post(`${apiUrl}/payment/updatePayment`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Set the API response in the state
      //generate tiket disini

      // /fix ini nnti transactiondatanya gak nemu
      // await AsyncStorage.setItem("lastTicketTransaction", JSON.stringify(transactiondata));
      console.log("okeh");
    } catch (error) {
      // Handle errors here
      console.log('API Error:', error.message);
    }
  };

  const generateTicket= async ()=> {

   
    try{
      const orderId = orderID;
      console.log("order id buat tiket",orderID);
      const generateTicketResponse = await axios.post(
        `${apiUrl}/tickets/GenerateTicket/${orderId}`
      );

      const userTicketsTransaction = await axios.get(
        `${apiUrl}/transaction/userId/${user_id}`
      );
      const historiesTransaction = userTicketsTransaction.data;
      await AsyncStorage.setItem("historiesTransaction", JSON.stringify(historiesTransaction));
      
    }catch(Error){
      console.log("Error when Generate Ticket" + Error);
    }

   
  }




  const handlePay = async () => {
    await handleTransactionPassword();
  };

  const handleBack = () => {
    // Handle logic when the Pay button is pressed
    // For now, let's navigate to a new page named "PaymentSuccess"
    navigation.navigate("KrlOrderForm");
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
        <TouchableOpacity onPress={handleBack}>
          {/* Left Icon (Back Arrow) */}
          <Image
            source={require("../images/ion_arrow-back.png")}
            style={styles.backArrowImage}
          />
        </TouchableOpacity>

        {/* Title (Purchase) */}
        <Text style={styles.title}>Validation</Text>
      </View>

      {/* Image in the middle below App Bar */}
      <View style={styles.centeredImageContainer}>
        <Image
          source={require("../images/background-item.png")}
          style={styles.centeredImage}
        />
        {/* Additional Image */}
        <Image
          source={require("../images/logo-bnitravelink-item.png")}
          style={styles.overlayImage}
        />

        {/* White background for payment confirmation data with shadow */}
        <View style={styles.paymentContainer}>
          <View style={styles.paymentConfirmationRow1}>
            <Text style={styles.paymentConfirmationLabel1}>
              Type of Service
            </Text>
            <Text
              style={[
                styles.paymentConfirmationValue1,
                styles.rightAlign,
                styles.interSemiBold,
                { maxWidth: 200 },
              ]}
            >
              {serviceName}
            </Text>
          </View>
          <View style={styles.paymentConfirmationRow}>
            <Text style={styles.paymentConfirmationLabel}>Account</Text>
            <Text
              style={[
                styles.paymentConfirmationValue,
                styles.rightAlign,
                styles.interSemiBold,
                { maxWidth: 200 },
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
              Rp {totalPrice}
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
          <View style={styles.transactionpass}>
            <Text style={styles.transactionpassText}>
              Put Your Transaction Password
            </Text>
          </View>
          <View></View>
          <View style={styles.passwordInputContainer}>
            <View style={styles.PassContainer}>
              <Image
                source={require("../images/Vector.png")}
                style={styles.VectorImage}
              />

              <TextInput
                style={styles.passwordInput}
                secureTextEntry={!showPassword}
                placeholder=" "
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
            </View>
          </View>
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Image
              source={
                showPassword
                  ? require("../images/gridicons_not-visible.png")
                  : require("../images/gridicons_visible.png")
              }
              style={styles.VisibilityImage}
            />
          </TouchableOpacity>
          {/* Show error message if there's any */}
          {errorMessage !== "" && (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          )}
        </View>
      </View>
      {/* White background at the bottom with a button */}
      <View style={styles.bottomWhiteBackground}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handlePay} // Menambahkan onPress event untuk menangani pembayaran
        >
          <Text style={styles.buttonText}>Pay</Text>
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
  },
  backArrow: {
    position: "absolute",
    left: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: fontTheme.semiBold,
    marginRight: 140,
  },
  centeredImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredImage: {
    width: 57.83,
    height: 58,
    top: 150,
    marginBottom: 20,
    resizeMode: "cover",
  },
  overlayImage: {
    position: "absolute",
    width: 44.86,
    height: 45,
    resizeMode: "cover",
    top: 50,
    marginBottom: 15,
  },
  paymentContainer: {
    backgroundColor: "#FFFFFF",
    width: 362,
    height: 155,
    borderRadius: 20,
    marginTop: 150,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 490,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 5,
  },
  paymentConfirmationRow: {
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  paymentConfirmationLabel: {
    fontSize: 14,
    textAlign: "left",
    color: "#005E6A",
    fontFamily: fontTheme.medium,
  },
  paymentConfirmationValue: {
    textAlign: "right",
    fontSize: 14,
    fontWeight: "600",
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
  interMedium: {
    fontFamily: fontTheme.medium,
  },
  paymentConfirmationRow1: {
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  paymentConfirmationLabel1: {
    fontFamily: fontTheme.medium,
    color: "#005E6A",
    fontSize: 14,
    textAlign: "left",
  },
  paymentConfirmationValue1: {
    textAlign: "right",
    fontSize: 14,
    fontWeight: "600",
  },
  transactionpassText: {
    marginTop: 78,
    textAlign: "center",
    fontSize: 14,
    color: "#005E6A",
  },
  passwordContainer: {
    alignItems: "center",
    width: "100%",
  },
  passwordInputContainer: {
    marginTop: 10,
    marginRight: 10,
    backgroundColor: "#FFFFFF",
    width: "100%",
    height: 50,
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
    // justifyContent: "space-between",
  },
  icon: {
    marginLeft: 5,
    marginBottom: 14,
  },
  backArrowImage: {
    width: 30,
    height: 30,
    marginRight: 120,
  },
  VectorImage: {
    width: 13.33,
    height: 17.5,
    // marginBottom: 15,
    marginLeft: 70,
    marginRight: 10,
  },

  VisibilityImage: {
    width: 20, // Adjust the width as needed
    height: 20, // Adjust the height as needed

    marginLeft: 320,
    top: -33,
  },
  bottomWhiteBackground: {
    width: 390,
    height: 98,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",

    alignItems: "center",
  },
  buttonContainer: {
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
  buttonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontFamily: "Inter-SemiBold",
    paddingHorizontal: 140,
    top: 4,
    fontWeight: "bold",
  },
  PassContainer: {
    // top: 18,
    // paddingTop: 10,
    fontSize: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  passwordInput: {
    // paddingRight: 190,
    //   color: "gray",
    width: "100%",
    marginLeft: 8,
    // marginBottom: 5,
    marginTop: 5,
  },
  errorMessage: {
    color: "red", // Set the text color to red
    fontSize: 12, // Set the font size
    marginTop: 5, // Add some top margin for spacing
    textAlign: "center",
  },
});

export default Validation;
