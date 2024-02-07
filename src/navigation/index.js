import React from "react";
import FirstLogin from "../screens/FirstLogin";
import HomeScreen from "../screens/homescreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Confirmation from "../screens/Confirmation";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="FirstLogin"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="FirstLogin" component={FirstLogin} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
