import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
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
const EticketIn = ({ selectedPeople }) => {
  const [ticketsDetail, setTicketsDetail] = useState([]);
  const [accordion, setAccordion] = useState({});

  const [userData, setUserData] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [ticketClick, setTicketClick] = useState("");

  useEffect(() => {
    const getUserData = async () => {
      try {
        const sessionData = await AsyncStorage.getItem("session");
        const parsedSessionData = JSON.parse(sessionData);
        setUserData(parsedSessionData);

        const serviceData = await AsyncStorage.getItem("travelinkData");
        const parsedServiceData = JSON.parse(serviceData);
        setServiceName(parsedServiceData.service);

        const ticketClickData = await AsyncStorage.getItem("ticketClick");
        const parsedTicketClickData = JSON.parse(ticketClickData);
        setTicketClick(parsedTicketClickData);

        await getTicketsDetail(parsedSessionData.jwt);
      } catch (error) {
        console.log("Error fetching user data: ", error);
      }
    };

    const parseTransactionData = async () => {
      try {
        const transactionData = await AsyncStorage.getItem("transaction");

        if (!transactionData) {
          console.log("Transaction data is empty.");
          return null;
        }

        const parsedTransactionData = JSON.parse(transactionData);

        if (!parsedTransactionData || !parsedTransactionData.skTransaction) {
          console.log("Invalid transaction data or missing skTransaction.");
          return null;
        }

        return parsedTransactionData;
      } catch (error) {
        console.log("Error parsing transaction data:", error);
        return null;
      }
    };

    const getTicketsDetail = async (jwtToken) => {
      try {
        const transactiondata = await parseTransactionData();
        const fkTransaction = transactiondata.skTransaction;

        // Check if fkTransaction has value
        if (!fkTransaction) {
          console.log("fkTransaction is empty.");
          return;
        }

        const response = await axios.get(`${apiUrl}/tickets/${fkTransaction}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        const data = response.data;

        const extractedData = data.map((ticket) => ({
          departure: ticket.transaction.departure,
        }));

        setTicketsDetail(extractedData);

        // // get last ticket transaction of the user
        // const userTicketsTransaction = await axios.get(
        //   `${apiUrl}/transaction/userId/${responseLogin.data.userId}`
        // );

        // const lastTicketTransaction = userTicketsTransaction.data[userTicketsTransaction.data.length - 1];

        await AsyncStorage.setItem(
          "lastTicketTransaction",
          JSON.stringify(transactiondata)
        );
      } catch (error) {
        console.log("Error storing tickets detail:", error);
      }
    };

    getUserData();
  }, []); // Empty dependency array to run once on component mount

  const [fontsLoaded] = useFonts({
    [fontTheme.regular]: require("../fonts/Inter/static/Inter-Regular.ttf"),
    [fontTheme.medium]: require("../fonts/Inter/static/Inter-Medium.ttf"),
  });

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    // Tutup semua accordion
    const updatedAccordion = {};
    // for (let i = 1; i <= 5; i++) {
    for (let i = 0; i < selectedPeople; i++) {
      updatedAccordion[i] = false;
    }

    // Buka atau tutup accordion yang diklik
    updatedAccordion[index] = !accordion[index];

    setAccordion(updatedAccordion);
    setActiveIndex(updatedAccordion[index] ? index : null);
  };

  // const [fontsLoaded] = useFonts({
  //   "Inter-SemiBold": require("../fonts/Inter/static/Inter-SemiBold.ttf"),
  //   "Inter-Regular": require("../fonts/Inter/static/Inter-Regular.ttf"),
  // });
  const navigation = useNavigation();

  if (!fontsLoaded) {
    // You can return an empty View or null for now, as we are only interested in the app bar
    return null;
  }

  const handleShow = () => {
    navigation.navigate("EticketOut");
  };

  const handleBack = () => {
    navigation.navigate("TicketDetails");
  };

  // const handleBack = () => {
  //   navigation.navigate("KrlOrderForm");
  // };

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
        {ticketClick !== "true" ? (
          <TouchableOpacity onPress={handleBack}>
            {/* Left Icon (Back Arrow) */}
            <Image
              source={require("../images/ion_arrow-back.png")}
              style={styles.backArrowImage}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.emptySpace} />
        )}

        {/* Title (Purchase) */}
        <Text style={styles.title}>E-Ticket</Text>
        <TouchableOpacity onPress={handleHome}>
          {/* Left Icon (Back Arrow) */}
          <Image
            source={require("../images/ic_round-home.png")}
            style={styles.homeImage}
          />
        </TouchableOpacity>
      </View>
      <ScrollView
      // contentContainerStyle={[styles.scrollContainer, { flexGrow: 1 }]}
      >
        {/* Image in the middle below App Bar */}
        <View style={styles.orderdetailContainer}>
          {/* White background for payment confirmation data with shadow */}
          {/* <Image
            source={require("../images/logo_krl.png")}
            style={styles.krlImage}
          /> */}
          {serviceName === "KRL" ? (
            <Image
              source={require("../images/kai-commuter-logo.png")}
              style={styles.krlImage}
              resizeMode="contain"
            />
          ) : serviceName === "TJ" ? (
            <Image
              source={require("../images/logotije.png")}
              style={styles.tijeImage}
              resizeMode="contain"
            />
          ) : serviceName === "MRT" ? (
            <Image
              source={require("../images/logomrt.png")}
              style={styles.mrtImage}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={require("../images/logolrt.png")}
              style={styles.lrtImage}
              resizeMode="contain"
            />
          )}
          <Text style={styles.entrancegateText}>Entrance Gate Ticket </Text>
          <View style={styles.commuterline}></View>
        </View>
        <View style={styles.accordion2}>
          <View style={styles.additionalButtonsContainer}>
            {ticketsDetail.map((ticket, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.additionalButton,
                  index === activeIndex &&
                    accordion[index] && { marginBottom: 200 },

                  // Tambahkan spasi di antara accordion yang terbuka
                  index !== 0 && accordion[index - 1] && { marginTop: 200 },
                  // accordion[index] && { marginBottom: 100 },
                ]}
                // {selectedPeople.map((_, index) => (
                //   <TouchableOpacity
                //     key={index}
                //     style={[
                //       styles.additionalButton,
                //       index === activeIndex &&
                //         accordion[index] && { marginBottom: 200 },
                //       index !== 0 && accordion[index] && { marginTop: 200 },
                //     ]}
                onPress={() => toggleAccordion(index)}
              >
                <View style={styles.orderDetailsRow}>
                  <Text style={styles.orderDetailsLabel}>
                    Ticket {index + 1}
                  </Text>
                  <Image
                    source={require("../images/sort-down.png")}
                    style={[
                      styles.orderDetailsValueImage,
                      accordion[index] && styles.rotateImage,
                    ]}
                  />
                </View>

                {accordion[index] && (
                  <View style={styles.accordion1Content}>
                    <View style={styles.accordionContent}></View>
                    <View style={{ height: 20 }} />
                    <View style={styles.contentContainer}>
                      <Text
                        style={[
                          styles.contentText,
                          {
                            textAlign: "center",
                            fontSize: 13,
                            color: "#005E6A",
                          },
                        ]}
                      >
                        QR code for entrance gate
                      </Text>
                      <Text
                        style={[
                          styles.additionalText,
                          { textAlign: "center", fontSize: 13 },
                        ]}
                      >
                        {ticket.departure}
                      </Text>
                      <Image
                        source={require("../images/qris.png")}
                        style={styles.contentImage}
                      />
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.warningfilledBackground}>
            <Image
              source={require("../images/warning.png")} // Ganti dengan path gambar yang sesuai
              style={styles.warningImage}
            />
            <Text style={styles.warningText}>
              Make sure to click Show Exit Gate Ticket if all entrance gate
              tickets have been scanned.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* White background at the bottom with a button */}
      <View style={styles.bottomWhiteBackground}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleShow} // Menambahkan onPress event untuk menangani pembayaran
        >
          <Text style={styles.buttonText}>Show Exit Gate Ticket</Text>
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
    top: 50,
    left: 15,
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
    marginRight: 165,
    marginLeft: 20,
  },
  homeImage: {
    // position: "absolute",
    marginTop: -5,
    marginLeft: -50,

    width: 30,
    height: 30,
  },
  emptySpace: {
    width: '25%', // Adjust the width to match the size of the back arrow
    height: 24, // Adjust the height to match the size of the back arrow
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

  backArrowImage: {
    width: 30,
    height: 30,
    marginRight: 100,
  },

  bottomWhiteBackground: {
    width: 390,
    height: 98,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
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
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
    paddingHorizontal: 68,
    top: 4,
    fontWeight: "500",
  },

  orderdetailContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  orderContainer: {
    backgroundColor: "#FFFFFF",
    width: 394,
    height: 572,
    marginTop: -150,
    marginLeft: 0,
    marginRight: 10,
    marginBottom: 0,
  },
  krlImage: {
    position: "absolute",
    width: 109.17,
    height: 40,
    top: 30,
    marginLeft: 145,
    resizeMode: "cover",
  },

  mrtImage: {
    position: "absolute",
    width: 150,
    height: 150,
    // top: 30,
    // marginLeft: 145,
    // resizeMode: "cover",
  },

  tijeImage: {
    position: "absolute",
    width: 160,
    height: 160,
  },

  lrtImage: {
    position: "absolute",
    width: 160,
    height: 160,
  },

  entrancegateText: {
    fontSize: 20,
    color: "#005E6A",
    fontWeight: "600",
    marginTop: 100,
    // marginBottom: 5,
  },
  additionalButtonsContainer: {
    // flexDirection: "row",
    // marginTop: 30
  },
  additionalButton: {
    backgroundColor: "#00A2B7",
    width: 361,
    height: 43,
    top: 60,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 5,
    marginBottom: 20,
    marginLeft: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 5,
  },
  additionalButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
  },

  orderDetailsLabel: {
    top: 4,
    marginLeft: 10,
    fontWeight: "600",
    fontSize: 14,
    textAlign: "left",
    color: "#FFFFFF",
    marginBottom: 10,
  },

  orderDetailsValueImage: {
    top: -4,
    right: 5,
    position: "absolute",
    width: 20,
    height: 20,
  },
  warningfilledBackground: {
    position: "relative",
    height: 43,
    backgroundColor: "#DECAF8",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    left: -10,
    marginHorizontal: 5,
    marginLeft: 15,
    marginTop: 270, // Atur jarak antara teks peringatan dan elemen di bawahnya// Gunakan posisi relatif untuk tata letak
    // zIndex: 1,
  },
  warningImage: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
  warningText: {
    paddingHorizontal: 15,
    bottom: 20,
    fontSize: 10,
    marginLeft: 22,
    color: "#5D21D1",
  },
  accordion1Content: {
    top: 0,
  },
  accordionContent: {
    width: 361,
    height: 439,
    backgroundColor: "rgba(0, 162, 183, 0.07)",
    top: -35,
    left: -20,
    position: "absolute",
    borderRadius: 20,
    paddingHorizontal: 90,
    paddingVertical: 20,
    paddingBottom: 90,
    marginBottom: -30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 5,
  },
  contentContainer: {
    position: "absolute",
    top: 30,
    marginLeft: 10,
    justifyContent: "center", // Meletakkan konten di tengah secara vertikal
    alignItems: "center", // Meletakkan konten di tengah secara horizontal
  },
  contentImage: {
    width: 300,
    height: 300,
    marginTop: 20,
    marginBottom: 100,
    justifyContent: "center", // Meletakkan konten di tengah secara vertikal
    alignItems: "center",
  },
  additionalText: {
    textAlign: "center",
    fontSize: 12,
    color: "#005E6A", // Warna teks tambahan
  },
  accordionContainer: {
    marginBottom: 20, // Atur jarak antara setiap accordion
    position: "relative", // Gunakan posisi relatif untuk konten di dalamnya
  },
  scrollContainer: {
    height: "500px",
  },
  accordion2: {
    marginTop: -20, // Menyesuaikan margin atas untuk accordion
    marginBottom: -80,
    paddingBottom: 80,
    // zIndex: 0, // Menempatkan accordion di bawah teks peringatan
  },
});

export default EticketIn;
