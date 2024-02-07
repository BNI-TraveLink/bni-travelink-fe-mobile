import React, { createContext } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./src/screens/SplashScreen";
import FirstLogin from "./src/screens/FirstLogin";
import HomePage from "./src/screens/HomePage";
import Purchase from "./src/screens/Purchase";
import TraveLink from "./src/screens/TraveLink";
import KrlOrderForm from "./src/screens/KrlOrderForm";
import EticketIn from "./src/screens/EticketIn";
import Validation from "./src/screens/Validation";
import Receipt from "./src/screens/Receipt";
import TicketDetails from "./src/screens/TicketDetails";
import Confirmation from "./src/components/Confirmation";
import HomeScreen from "./src/screens/homescreen";
import TestApp from "./src/screens/TestApp";
import EticketOut from "./src/screens/EticketOut";

// export const FontThemeContext = createContext();
const Stack = createStackNavigator();

function App() {
  // Tentukan tema font di sini
  const fontTheme = {
    regular: "Inter-Regular",
    medium: "Inter-Medium",
    semiBold: "Inter-SemiBold",
  };

  // const handleBack = () => {
  //   // Handle logic when the Back button is pressed globally
  //   // For now, let's navigate back to the previous screen
  //   // (This logic assumes that your Confirmation screen is the only screen with a Back button)
  //   navigation.goBack();
  // };
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="FirstLogin" component={FirstLogin} />
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="Purchase" component={Purchase} />
          <Stack.Screen name="TraveLink" component={TraveLink} />
          <Stack.Screen name="KrlOrderForm" component={KrlOrderForm} />
          <Stack.Screen name="Validation" component={Validation} />
          <Stack.Screen name="Receipt" component={Receipt} />
          <Stack.Screen name="TicketDetails" component={TicketDetails} />
          <Stack.Screen name="EticketIn" component={EticketIn} />
          <Stack.Screen name="EticketOut" component={EticketOut} />
        </Stack.Navigator>
      </NavigationContainer>

      {/* <EticketOut></EticketOut> */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
});

export default App;
