import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

const GradientBackground = ({ children }) => {
  return (
    <LinearGradient
      colors={["#00A2B7", "#F4FBFC", "#F6FCFC", "#FFFFFF"]} // Sesuaikan dengan warna gradien yang diinginkan
      style={styles.container}
    >
      <View style={styles.content}>{children}</View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default GradientBackground;
