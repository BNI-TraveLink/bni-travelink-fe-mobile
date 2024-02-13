import React, { useEffect, useState } from "react";
import { Image, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
const apiUrl = Constants.manifest.extra.API_URL;

// let userHistoriesTransaction = [];

const HistoryTraveLink = () => {
  const navigation = useNavigation();
  const [userHistoriesTransaction, setUserHistoriesTransaction] = useState([]);
  const [stations, setStations] = useState([]);



  const getHistoryTransaction = async () => {
    // userHistoriesTransaction = [];
    setUserHistoriesTransaction([]);
    try {
    
      const historiesTransaction = await AsyncStorage.getItem("historiesTransaction");
      const parsedHistoriesTransaction = JSON.parse(historiesTransaction);
      // userHistoriesTransaction = parsedHistoriesTransaction;

      // parsedHistoriesTransaction.reverse();
      // const reversedAndSlicedHistoriesTransaction = parsedHistoriesTransaction.slice(0, 5);
      // console.log("history order", parsedHistoriesTransaction);
      // console.log("history order reverse", reversedAndSlicedHistoriesTransaction);

      setUserHistoriesTransaction(parsedHistoriesTransaction);
    } catch (error) {
      console.log("Error while fetching History Transaction: " + error);
    }
  }

  useEffect(() => {
    const loadData = async () => {
      await getHistoryTransaction();
    };
  loadData();
}, []);

  useFocusEffect(
    React.useCallback(() => {
      console.log("masuk lagi");
      getHistoryTransaction();
    }, []) // Remove lastTicket from the dependency array
  );

  const formatDate = (dateString) => {
    const createdAtDate = new Date(dateString);
    const day = createdAtDate.getDate();
    const month = createdAtDate.toLocaleString('default', { month: 'short' });
    const year = createdAtDate.getFullYear();
    const hours = createdAtDate.getHours();
    const minutes = createdAtDate.getMinutes();
  
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  }

  const handleHistoryActive = async (lastTicket) => {
    console.log("handlehistoryactive", lastTicket);
    await AsyncStorage.setItem("ticketClick", JSON.stringify("true"));
    const dataToSave = {
      service: lastTicket.service.name,
      stations: null, // Use the updated stations
      price: null
       };
    await AsyncStorage.setItem('travelinkData', JSON.stringify(dataToSave));
    await AsyncStorage.setItem("transaction", JSON.stringify(lastTicket));
    navigation.navigate("EticketIn");
  };

  const handleHistoryReorder = async (lastTicket) => {
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
    "Inter-Medium": require("../fonts/Inter/static/Inter-Medium.ttf"),
    "Poppins-Regular": require("../fonts/Poppins/Poppins-Regular.ttf"),
    "Inter-SemiBold": require("../fonts/Inter/static/Inter-SemiBold.ttf"),
    "Inter-Light": require("../fonts/Inter/static/Inter-Light.ttf"),
    "Poppins-SemiBold": require("../fonts/Poppins/Poppins-SemiBold.ttf"),
  });

  const handleButtonLoadMore = () => {
    console.log("Tombol ditekan!");
  };

  if (fontsLoaded) {
    return (
      <View style={{ paddingLeft: 10, paddingRight: 10 }}>
        <Text style={styles.tittleHistory}>History</Text>
        {console.log("userHistoriesTransaction ", userHistoriesTransaction)}
        {userHistoriesTransaction.length > 0 && userHistoriesTransaction.map((ticket, index) => (
          <View key={ticket.skTransaction} style={ticket.active ? styles.historyContainerActive : styles.historyContainerUsed}>
            <TouchableOpacity onPress={() => ticket.active ? handleHistoryActive(ticket) : handleHistoryReorder(ticket)}
            >
            <View style={ticket.active ? styles.historyContentActive : styles.historyContentUsed}>
              <View style={ticket.active ? styles.listContainerActive : styles.listContainerUsed}>
                {/* <Image
                  source={require("../images/commuter-historyItem.png")}
                  style={{ height: 40, width: 40 }}
                ></Image> */}

                {ticket.service.name === "KRL" ? (
                  <Image
                    source={require("../images/commuter-historyItem.png")}
                    style={{ height: 40, width: 40 }}
                  />
                ) : ticket.service.name === "TJ" ? (
                  <Image
                    source={require("../images/tije-historyItem.png")}
                    style={{ height: 40, width: 40 }}
                  />
                ) : ticket.service.name === "MRT" ? (
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
                  <Text style={styles.tittleTraveLinkActive}>{ticket.service.name}</Text>
                  <View style={styles.destinationContainer}>
                    <Text style={ticket.active ? styles.tittleDestinationActive : styles.tittleDestinationUsed}>
                      {ticket.departure}
                    </Text>
                    <Text style={ticket.active ? styles.tittleDestinationActive : styles.tittleDestinationUsed}>-</Text>
                    <Text style={ticket.active ? styles.tittleDestinationActive : styles.tittleDestinationUsed}>
                      {ticket.destination}
                    </Text>
                  </View>
                  <Text style={ticket.active ? styles.tittleDateActive : styles.tittleDateUsed}>{formatDate(ticket.createdAt)}</Text>
                </View>
                <View style={styles.listRightContainer}>
                  <View style={ticket.active ? styles.activeContainerActive : styles.activeContainerUsed}>
                    <View style={styles.activeContent}>
                      <Text style={ticket.active ? styles.tittleActive : styles.tittleUsed}>{ticket.active ? "Active" : "Used"}</Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      ticket.active ? styles.tittleOrderIDActive : styles.tittleOrderIDUsed,
                      { marginTop: 12, marginRight: 10 },
                    ]}
                    >
                    #{ticket.orderId.toString().padStart(4, '0')}
                  </Text>
                </View>
              </View>
            </View>
            </TouchableOpacity>
          </View>
        ))}
        {/* <View style={{marginTop: 60}}>
          <TouchableOpacity
            style={styles.buttonLoadMore}
            onPress={handleButtonLoadMore}
          >
            <Text style={styles.tittleLoadMore}>Load More</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    );
  } else {
    return <Text>Loading...</Text>;
  }
};

const styles = StyleSheet.create({
  tittleHistory: {
    color: "#005E6A",
    fontFamily: "Inter-Medium",
    fontSize: 12,
  },

  historyContainerActive: {
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

  historyContentActive: {
    marginTop: 10,
  },

  listContainerActive: {
    marginLeft: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 10
  },

  textContainer: {
    flex : 1,
  },

  destinationContainer: {
    flexDirection: "row",
    overflow: "hidden"
    // flex: 1,
    // overflow: 'hidden'
  },

  tittleTraveLinkActive: {
    color: "#FE7624",
    fontFamily: "Poppins-Regular",
    fontSize: 11,
  },

  tittleDestinationActive: {
    color: "#005E6A",
    fontFamily: "Inter-SemiBold",
    fontSize: 12,
    marginTop: 5,
  },

  tittleDateActive: {
    color: "#FE7624",
    fontFamily: "Inter-Light",
    fontSize: 10,
  },

  activeContainerActive: {
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

  tittleOrderIDActive: {
    color: "#FE7624",
    fontFamily: "Inter-Regular",
    fontSize: 10,
  },

  listRightContainer: {
    alignItems: "flex-end",
  },

  tittleTraveLinkUsed: {
    color: "#696969",
    fontFamily: "Poppins-Regular",
    fontSize: 11,
  },

  tittleDestinationUsed: {
    color: "#696969",
    fontFamily: "Inter-SemiBold",
    fontSize: 12,
    marginTop: 5,
  },

  tittleDateUsed: {
    color: "#797979",
    fontFamily: "Inter-Light",
    fontSize: 10,
  },

  activeContainerUsed: {
    backgroundColor: "#D2D2D2",
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

  tittleUsed: {
    color: "#696969",
    fontFamily: "Inter-Medium",
    fontSize: 12,
  },

  tittleOrderIDUsed: {
    color: "#797979",
    fontFamily: "Inter-Regular",
    fontSize: 10,
  },

  historyContainerUsed: {
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

  historyContentUsed: {
    marginTop: 10,
  },

  listContainerUsed: {
    marginLeft: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 10
  },

  buttonLoadMore: {
    backgroundColor: "#FE7624",
    borderRadius: 20,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position: "absolute",
    bottom: 0,
    width: "40%",
    height: 40,
  },

  tittleLoadMore: {
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
  },
});

export default HistoryTraveLink;
