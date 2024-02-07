// BottomBar.js

import React from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";

const BottomBarOrderForm = ({ handlePay, selectedPeople, price }) => {
  return (
    <View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity style={styles.buttonContainer} onPress={handlePay}>
          <Text style={styles.buttonText}>Pay</Text>
          <Text style={styles.pricePay}>Rp {selectedPeople * price}</Text>
          <Image
            source={require("../images/next-item.png")}
            style={{ height: 40, width: 40, marginLeft: 10 }}
          ></Image>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: 362,
    height: 49,
    backgroundColor: "#F15A23",
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
    flexDirection: "row",
    alignItems: "center",
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

export default BottomBarOrderForm;
