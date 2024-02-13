import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useFonts } from "expo-font";
import GridHomeMenu from "../components/GridHomeMenu";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomBarPage from "../components/BottomBarPage";
import moment from "moment";

import Constants from "expo-constants";
const apiUrl = Constants.manifest.extra.API_URL;


// let lastTicket = null;

const window = Dimensions.get("window");
const windowWidth = window.width;
const windowHeight = window.height;

const HomePage = () => {
  const [lastTicket, setLastTicket] = useState(null);
  const [isHidden, setIsHidden] = useState(false);

  const [saldo, setSaldo] = useState(0);
  const [userData, setUserData] = useState("");

  const [stations, setStations] = useState([]);

  const getUserData = async () => {
    // lastTicket = null;
    setLastTicket(null);
    try {
      const sessionData = await AsyncStorage.getItem("session");
      const parsedSessionData = JSON.parse(sessionData);
      setUserData(parsedSessionData);

      const responseBalance = await axios.get(
        `${apiUrl}/balance/getBalanceByUserId/${parsedSessionData.userId}`, {
          headers: {
            Authorization: `Bearer ${parsedSessionData.jwt}`,
          }
        }
      );
      await AsyncStorage.setItem("balance", JSON.stringify(responseBalance.data));

      
      // const balanceSessionData = await AsyncStorage.getItem("balance");
      // const parsedBalanceData = JSON.parse(balanceSessionData);
      setSaldo(responseBalance.data.toString());


      // 3. Get the last ticket transaction
      const lastTicketTransaction = await AsyncStorage.getItem(
        "lastTicketTransaction"
      );
      const parsedLastTicketTransaction = JSON.parse(lastTicketTransaction);
      // lastTicket = parsedLastTicketTransaction;
      setLastTicket(parsedLastTicketTransaction);

      // console.log("lasticket getdata", lastTicket);
      console.log("lasticket getdata", lastTicket);
    } catch (error) {
      console.log("Error fetching data: " + error);
    }
  };
  // console.log("lasticket", lastTicket);
  // getUserData();

  useFocusEffect(
    React.useCallback(() => {
      console.log("masuk lagi");
      getUserData();
    }, []) // Remove lastTicket from the dependency array
  );
  

    useEffect(() => {
      const loadData = async () => {
        await getUserData();
        // After fetching the data, you can update the state or take any necessary actions
      };

    // Call getUserData when the component mounts
    loadData();
  }, []);

  // useEffect(() => {
  //   const loadData = async () => {
  //     await getUserData();
  //     // After fetching the data, you can update the state or take any necessary actions
  //   };

  //   // Call loadData every time the component renders
  //   loadData();
  // },[]);

  const toggleVisibility = () => {
    setIsHidden(!isHidden);
  };

  const navigation = useNavigation();

  const handleLogOutPress = () => {
    navigation.navigate("FirstLogin");
  };

  const handlePurchasePress = () => {
    navigation.navigate("Purchase");
  };

  const handleHistoryActive = async () => {
    // console.log("handlehistoryactive", lastTicket);
    await AsyncStorage.setItem("ticketClick", JSON.stringify("true"));
    await AsyncStorage.setItem("transaction", JSON.stringify(lastTicket));
    navigation.navigate("EticketIn");
  };

  const handleHistoryReorder = async () => {
    setStations([]);

    try {
      await AsyncStorage.setItem("reorder", JSON.stringify(lastTicket));
      await getListStations(lastTicket.service.name);
      navigation.navigate("KrlOrderForm");
    } catch (error) {
      console.log("Error hitting the API:", error);
    }
  };

  const getListStations = async (travelinkService) => {
    const url = `${apiUrl}/service/getStationByServiceName`;

    try {
      const response = await axios.get(url, {
        params: {
          serviceName: travelinkService,
        },
        headers: {
          Authorization: `Bearer ${userData.jwt}`,
        }
      });

      const newStations = response.data.map((station) => ({
        label: station.station_name,
        value: station.station_name,
      }));

      setStations(newStations);

      const dataToSave = {
        service: travelinkService,
        stations: newStations, // Use the updated stations
        price: response.data[0].fkService.price,
      };

      await AsyncStorage.setItem("travelinkData", JSON.stringify(dataToSave));
    } catch (error) {
      console.log("Error getting station data:", error);
      throw error; // Rethrow the error to be caught in handleMrtPress
    }
  };

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../fonts/Poppins/Poppins-SemiBold.ttf"),
    "Poppins-ExtraBold": require("../fonts/Poppins/Poppins-ExtraBold.ttf"),
    "Poppins-Medium": require("../fonts/Poppins/Poppins-Medium.ttf"),
    "Poppins-Bold": require("../fonts/Poppins/Poppins-Bold.ttf"),
    "Inter-SemiBold": require("../fonts/Inter/static/Inter-SemiBold.ttf"),
    "Inter-Medium": require("../fonts/Inter/static/Inter-Medium.ttf"),
    "Inter-Bold": require("../fonts/Inter/static/Inter-Bold.ttf"),
    "Inter-Light": require("../fonts/Inter/static/Inter-Light.ttf"),
  });

  if (fontsLoaded) {
    return (
      <ImageBackground
        source={require("../images/background-container.png")}
        style={styles.backgroundGradient}
      >
        <View style={styles.appBar}>
          <Image
            source={require("../images/customer-service.png")}
            style={{ height: 20, width: 20 }}
          />
          <Text style={styles.chatUs}>chatUs</Text>
          <View style={styles.centerContent}>
            <Image
              source={require("../images/logobniputih.png")}
              style={styles.logo}
            />
          </View>
          <Image
            source={require("../images/notification.png")}
            style={{ marginRight: 8, height: 20, width: 16 }}
          />
          <TouchableOpacity onPress={handleLogOutPress}>
            <Image
              source={require("../images/log-out.png")}
              style={{ height: 20, width: 20 }}
            />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={{ paddingLeft: 10, paddingRight: 10 }}>
            <View style={styles.custProfile}>
              {/* <Text style={styles.custText}>Hello, Minara Club!</Text> */}
              <Text style={styles.custText}>Hello, {userData.userId}!</Text>
              <View style={styles.profileContainer}>
                <Image
                  source={require("../images/profile.jpeg")}
                  style={styles.circleImage}
                ></Image>
              </View>
            </View>
            <View style={styles.balanceContainer}>
              <View style={styles.saldoContainer}>
                <Text style={styles.saldoLabel}>Rp </Text>
                <Text style={[styles.saldoText, { fontSize: isHidden ? 11 : 20, marginTop: 5 }]}>
                  {isHidden ? "⬤⬤⬤⬤⬤⬤⬤⬤" : parseFloat(saldo).toLocaleString('id-ID')}
                </Text>
              </View>
              <TouchableOpacity onPress={toggleVisibility}>
                <Image
                  source={
                    isHidden
                      ? require("../images/visible.png")
                      : require("../images/not-visible.png")
                  }
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.accountContainer}>
              <Image
                source={require("../images/solid_down.png")}
                style={{ height: 25, width: 25, marginRight: 4 }}
              />
              <View style={{ alignItems: "center" }}>
                <Text style={styles.accountText}>{userData.accountNumber}</Text>
                <Text style={styles.accountLabel}>BNI Taplus Muda</Text>
              </View>
              <Image
                source={require("../images/copy.png")}
                style={{ height: 25, width: 25, marginLeft: 2 }}
              ></Image>
            </View>
            <View style={styles.menuContainer}>
              <View style={styles.gridContainer}>
                <GridHomeMenu
                  imageSource={require("../images/transfer-item.png")}
                  labelText={"Transfer"}
                />
                <GridHomeMenu
                  imageSource={require("../images/payment-item.png")}
                  labelText={"Payment"}
                />
                <TouchableOpacity onPress={handlePurchasePress}>
                  <GridHomeMenu
                    imageSource={require("../images/purchase-item.png")}
                    labelText={"Purchase"}
                  />
                </TouchableOpacity>
                <GridHomeMenu
                  imageSource={require("../images/investment-item.png")}
                  labelText={"Investment"}
                />
              </View>
              <View style={styles.gridContainer}>
                <GridHomeMenu
                  imageSource={require("../images/life-goals-item.png")}
                  labelText={"Life Goals"}
                />
                <GridHomeMenu
                  imageSource={require("../images/digital-loan-item.png")}
                  labelText={"Digital Loan"}
                />
                <GridHomeMenu
                  imageSource={require("../images/dikado-item.png")}
                  labelText={"DiKado"}
                />
                <GridHomeMenu
                  imageSource={require("../images/another-menu-item.png")}
                  labelText={"Another Menu"}
                />
              </View>
            </View>
            <View style={styles.pointContainer}>
              <Text style={styles.pointText}>MyPoints</Text>
              <Text style={styles.pointText}>1.946</Text>
            </View>
            {console.log("lasticket JSX")}
            {
              lastTicket != null
              ? (
              <View>
                <Text style={styles.tittleBNITraveLink}>My BNI TraveLink</Text>
                <TouchableOpacity onPress={lastTicket.active ? handleHistoryActive : handleHistoryReorder}>
                {/* <TouchableOpacity onPress={lastTicket.active ? handleHistoryReorder : handleHistoryActive}> */}
                  <View style={styles.historyContainer}>
                    <View style={styles.historyContent}>
                      <View style={styles.listContainer}>
                        {/* <Image
                          source={require("../images/commuter-historyItem.png")}
                          style={{ height: 40, width: 40 }}
                        ></Image> */}

                        {lastTicket.service.name === "KRL" ? (
                          <Image
                            source={require("../images/commuter-historyItem.png")}
                            style={{ height: 40, width: 40 }}
                          />
                        ) : lastTicket.service.name === "TJ" ? (
                          <Image
                            source={require("../images/tije-historyItem.png")}
                            style={{ height: 40, width: 40 }}
                          />
                        ) : lastTicket.service.name === "MRT" ? (
                          <Image
                            source={require("../images/mrt-historyItem.png")}
                            style={{ height: 40, width: 40 }}
                          />
                        ) : (
                          <Image
                            source={require("../images/lrt-historyItem.png")}
                            style={{ height: 40, width: 40 }}
                          />
                        )}

                        <View style={styles.textContainer}>
                          <Text style={styles.tittleTraveLink}>{lastTicket.service.name}</Text>
                          <View style={styles.destinationContainer}>
                            <Text style={styles.tittleDestination}>
                              {/* Jakarta Kota */}
                              {lastTicket.departure}
                            </Text>
                            <Text style={styles.tittleDestination}>-</Text>
                            <Text style={styles.tittleDestination}>
                              {/* Tanjung Barat */}
                              {lastTicket.destination}
                            </Text>
                          </View>
                          <Text style={styles.tittleDate}>
                            {/* Valid until 15 Feb 2024, 23.59 */}
                            Valid until {moment(lastTicket.expiredAt).format('D MMM YYYY,').concat(' 23.59')}
                          </Text>
                        </View>
                        <View style={styles.listRightContainer}>
                          {/* <View style={lastTicket.active ? styles.activeContainer : styles.reorderContainer}>
                            <View style={lastTicket.active ? styles.activeContainer : styles.reorderContainer}> */}
                            {console.log("styling lastTicket.active", lastTicket.active)}
                          <View style={lastTicket.active ? styles.activeContainer : styles.reorderContainer}>
                            <View style={lastTicket.active ? styles.activeContainer : styles.reorderContainer}>
                              <View style={styles.activeContent}>
                                <Text style={lastTicket.active ? styles.tittleActive : styles.tittleUsed}> {lastTicket.active ? "Active" : "Reorder"} </Text>
                              </View>
                            </View>
                          </View>
                          <Text
                            style={[
                              styles.tittleOrderID,
                              { marginTop: 12, marginRight: 10 },
                            ]}
                          >
                            #{lastTicket.orderId.toString().padStart(4, '0')}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              ) :
              null
            }
            <Text style={styles.eWalletsText}>My E-Wallets</Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <View style={{ flexDirection: "row", marginBottom: 10 }}>
                <View style={styles.myWalletContainer}>
                  <View style={styles.myWalletContent}>
                    <Image
                      source={require("../images/gopay-item.png")}
                      style={{ width: 60, height: 60, objectFit: "contain" }}
                    />
                    <View style={{ marginLeft: 5 }}>
                      <Text style={styles.nameLabel}>Go-Pay</Text>
                      <Text style={styles.nameText}>Rp 11.023</Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.myWalletContainer, { marginLeft: 10 }]}>
                  <View style={styles.myWalletContent}>
                    <Image
                      source={require("../images/linkaja-item.png")}
                      style={{ width: 60, height: 60, objectFit: "contain" }}
                    />
                    <View style={{ marginLeft: 5 }}>
                      <Text style={styles.nameLabel}>LinkAja</Text>
                      <Text style={styles.nameText}>Rp 297.000</Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.myWalletContainer, { marginLeft: 10 }]}>
                  <View style={styles.myWalletContent}>
                    <Image
                      source={require("../images/ovo-item.png")}
                      style={{ width: 60, height: 60, objectFit: "contain" }}
                    />
                    <View style={{ marginLeft: 5 }}>
                      <Text style={styles.nameLabel}>OVO</Text>
                      <Text style={styles.nameText}>Rp 19.460</Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.myWalletContainer, { marginLeft: 10 }]}>
                  <View style={styles.myWalletContent}>
                    <Image
                      source={require("../images/dana-item.png")}
                      style={{ width: 60, height: 60, objectFit: "contain" }}
                    />
                    <View style={{ marginLeft: 5 }}>
                      <Text style={styles.nameLabel}>DANA</Text>
                      <Text style={styles.nameText}>Rp 26.297</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
            <Text style={styles.promoText}>Promotions & Information</Text>
            <ScrollView horizontal={true} showsVerticalScrollIndicator={false}>
              <View style={{ flexDirection: "row" }}>
                <Image
                  source={require("../images/promo1.png")}
                  style={styles.promoContent}
                />
                <Image
                  source={require("../images/promo2.png")}
                  style={[styles.promoContent, { marginLeft: 10 }]}
                />
              </View>
            </ScrollView>
          </View>
        </ScrollView>
        <BottomBarPage />
      </ImageBackground>
    );
  }
};

const styles = StyleSheet.create({
  backgroundGradient: {
    paddingTop: 30,
    flex: 1,
    height: windowHeight * 0.53,
  },

  appBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    // backgroundColor: 'white',
    borderBottomWidth: 2,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    // elevation: 2,
  },

  chatUs: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    marginLeft: 5,
  },

  centerContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    paddingRight: 20, // mengatur logo BNI ketengah
  },

  logo: {
    width: 132,
    height: 40,
  },

  custProfile: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // marginTop: 10,
  },

  custText: {
    color: "#FFFFFF",
    fontSize: 25,
    fontFamily: "Poppins-SemiBold",
  },

  profileContainer: {
    borderRadius: 50,
    overflow: "hidden",
  },

  circleImage: {
    width: 65,
    height: 65,
    borderRadius: 50,
    marginTop: 9,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  saldoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },

  saldoLabel: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: "Poppins-ExtraBold",
    marginRight: 5,
    marginTop: 3,
  },

  saldoText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-Bold",
    letterSpacing: 1, // mengatur agar tidak ada space
  },

  icon: {
    width: 20,
    height: 20,
    marginLeft: 6,
  },

  accountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },

  accountText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "Poppins-Regular",
  },

  accountLabel: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "Poppins-Regular",
    marginTop: -5,
  },

  menuContainer: {
    justifyContent: "center",
    marginTop: 30,
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

  pointContainer: {
    marginTop: 10,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  pointText: {
    fontSize: 16,
    color: "#005E6A",
    fontFamily: "Poppins-Medium",
    paddingLeft: 13,
    paddingRight: 13,
    paddingTop: 9,
    paddingBottom: 9,
  },

  eWalletsText: {
    fontSize: 16,
    color: "#005E6A",
    fontFamily: "Inter-SemiBold",
    paddingLeft: 13,
    paddingRight: 13,
    paddingTop: 17,
    paddingBottom: 9,
  },

  myWalletContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    width: 165,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  myWalletContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  nameLabel: {
    color: "#005E6A",
    fontSize: 17,
    fontFamily: "Inter-SemiBold",
    marginRight: 5,
    alignItems: "center",
  },

  nameText: {
    color: "#005E6A",
    fontSize: 16,
    fontFamily: "Inter-Bold",
    marginTop: -3,
  },

  promoText: {
    fontSize: 16,
    color: "#005E6A",
    fontFamily: "Inter-SemiBold",
    paddingLeft: 13,
    paddingRight: 13,
    paddingTop: 5,
    paddingBottom: 9,
  },

  promoContent: {
    width: 245,
    height: 124,
  },

  tittleBNITraveLink: {
    fontSize: 16,
    color: "#005E6A",
    fontFamily: "Inter-SemiBold",
    paddingLeft: 13,
    paddingRight: 13,
    paddingTop: 17,
  },

  historyContainer: {
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
    marginTop: 10,
  },

  historyContent: {
    marginTop: 10,
  },

  listContainer: {
    marginLeft: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 10
  },

  textContainer: {
    flex: 1
  },

  destinationContainer: {
    flexDirection: "row",
    overflow: "hidden"
  },

  tittleTraveLink: {
    color: "#FE7624",
    fontFamily: "Poppins-Regular",
    fontSize: 11,
  },

  tittleDestination: {
    color: "#005E6A",
    fontFamily: "Inter-SemiBold",
    fontSize: 12,
    marginTop: 5,
  },

  tittleDate: {
    color: "#FE7624",
    fontFamily: "Inter-Light",
    fontSize: 10,
  },

  activeContainer: {
    backgroundColor: "#A1E496",
    borderRadius: 20,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  activeContent: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 20,
    marginRight: 20,
  },

  tittleActive: {
    color: "#005E6A",
    fontFamily: "Inter-Medium",
    fontSize: 12,
  },

  tittleOrderID: {
    color: "#FE7624",
    fontFamily: "Inter-Regular",
    fontSize: 10,
  },

  listRightContainer: {
    alignItems: "flex-end",
  },

  reorderContainer: {
    backgroundColor: "#82E5F2",
    borderRadius: 20,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  reorderContent: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 20,
    marginRight: 20,
  },

  tittleReorder: {
    color: "#005E6A",
    fontFamily: "Inter-Medium",
    fontSize: 12,
  },
});

export default HomePage;
