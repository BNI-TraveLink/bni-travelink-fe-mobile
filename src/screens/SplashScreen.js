import React, { useEffect, useRef, useState } from "react";
import GradientBackground from "../components/GradientBackground";
import { Animated, View, Text, Image, StyleSheet } from "react-native";
import * as Font from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { Dimensions } from "react-native";

const InterRegular = require("../fonts/Inter/static/Inter-Regular.ttf");

const window = Dimensions.get('window');
const windowWidth = window.width;
const windowHeight = window.height;

const SplashScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [fontLoaded, setFontLoaded] = useState(false); // State untuk mengontrol apakah font sudah terload atau belum

  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        "Inter-Regular": InterRegular,
      });
      setFontLoaded(true);
    };

    loadFont();
  }, []);

  useEffect(() => {
    if (fontLoaded) {
      const fadeOut = Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      });

      const timer = setTimeout(() => {
        navigation.replace("FirstLogin");
      }, 3000);

      return () => {
        clearTimeout(timer);
        fadeOut.stop();
      };
    }
  }, [fadeAnim, fontLoaded, navigation]);

  return (
    <GradientBackground>
      {fontLoaded && (
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.container}>
            <Image
              source={require("../images/logo46.png")}
              style={[styles.icon, { position: "absolute", top: -15 }]}
            />
            <Image
              source={require("../images/logolengkapbni.png")}
              style={[styles.iconbni, { position: "absolute", top: -15 }]}
            />
            <Image
              source={require("../images/logolps.png")}
              style={[styles.iconlps, { position: "absolute", top: -15 }]}
            />
            <Text style={[styles.text, { fontFamily: "Inter-Regular" }]}>
              PT Bank Negara Indonesia (Persero) Tbk. berizin dan diawasi oleh
              Otoritas Jasa Keuangan (OJK) serta merupakan peserta penjamin
              Lembaga Penjamin Simpanan (LPS)
            </Text>
            <Text style={[styles.hakcipta, { fontFamily: "Inter-Regular" }]}>
              Hak Cipta ⓒ 2023 BNI Mobile Banking
            </Text>
            {/* Menambahkan gambar pattern di bawah */}
            <Image
              source={require("../images/patternbawah.png")}
              style={styles.patternBawah}
            />
          </View>
        </Animated.View>
      )}
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: windowWidth,
    height: windowHeight * 0.4,
  },
  iconbni: {
    width: 188,
    height: 70,
    marginTop: 291,
    marginBottom: 483,
    marginLeft: 104,
    marginRight: 97.78,
  },
  iconlps: {
    width: windowWidth * 0.2,
    height: windowHeight * 0.1,
    marginBottom: 193,
    marginLeft: 155,
    marginRight: 155,
    marginVertical: windowHeight * 0.65
  },
  text: {
    color: "#696969",
    fontSize: windowHeight * 0.012,
    textAlign: "center",
    marginTop: 627,
    marginVertical: 0.7,
    marginBottom: 1,
  },
  hakcipta: {
    color: "#696969",
    fontSize: windowWidth * 0.025,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 165,
    paddingHorizontal: 50,
  },
  patternBawah: {
    position: "absolute", // Menempatkan gambar di bagian bawah layar
    bottom: -25, // Pastikan berada di tepi bawah
    width: windowWidth, // Lebar gambar sama dengan lebar jendela
    height: windowHeight * 0.25,
    resizeMode: "cover", // Pastikan gambar menutupi area yang ditentukan tanpa kehilangan proporsi
  },
});

export default SplashScreen;
