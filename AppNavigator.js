import React, { useState, useRef, useEffect } from "react";
import "./services/translationService";
import { View, StyleSheet, StatusBar, Image, Animated, Text, TouchableOpacity, Dimensions } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChordFinder from "./screens/ChordFinderScreen";
import ChordPosition from "./screens/ChordPositionScreen";
import { Asset } from "expo-asset";
import { setChordError, withAccessToStore } from "./redux/store";

import TranslationSwitch from "./components/TranslationSwitch";
import { theme } from "./utils/styleUtils";
import { Icon } from "galio-framework";
import { useTranslation } from "react-i18next";
import {LinearGradient} from 'expo-linear-gradient';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const Tab = createBottomTabNavigator();
function cacheImages(images) {
  return images.map((image) => {
    return Asset.fromModule(image).downloadAsync();
  });
}
function AppNavigator(props) {
  const [isReady, setReady] = useState(false);
  const { t, i18n } = useTranslation();
  const _loadAssetsAsync = async () => {
    const imageAssets = cacheImages([
      require("./assets/icon.png"),
      require("./assets/guitar0.png"),
      require("./assets/guitar1.png"),
      require("./assets/guitar2.png"),
      require("./assets/guitar3.png"),
      require("./assets/guitar4.png"),
      require("./assets/guitar5.png"),
      require("./assets/guitar6.png"),
      require("./assets/guitarNeck.png"),
    ]);

    await Promise.all([...imageAssets]);
  };
  const icon = require("./assets/icon.png");
  const [error, setError] = useState(props.state.chord.error);
  const errorAnim = useRef(new Animated.Value(0)).current;

  // if (!isReady) {
  //   return (
  //     <AppLoading
  //       startAsync={_loadAssetsAsync}
  //       onFinish={() => setReady(true)}
  //       onError={console.warn}
  //     />
  //   );
  // }

  const closeError = () => {
    setChordError(false);
  }

  useEffect(()=>{
    setError(props.state.chord?.error);
  },[props.state.chord])

  useEffect(() => {
    if(error){
      Animated.timing(errorAnim, {
        toValue: Dimensions.get('screen').width * 0.8 - 4,
        duration: 10000,
        useNativeDriver: false,
      }).start(() => closeError());
    }else{
      errorAnim.resetAnimation()
    }
  }, [error]);

  return (
      <NavigationContainer>
        <StatusBar />
        <LinearGradient colors={[theme.color.headerBackground, '#0e1215',theme.color.background]} style={styles.header}>
          <Image source={icon} style={styles.headerIcon} />
          <TranslationSwitch />
        </LinearGradient>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === "Home") {
                iconName = "search1";
              } else if (route.name === "ChordPosition") {
                iconName = "book";
              }
              return <Icon name={iconName} family="antdesign" color={color} />;
            },
              tabBarHideOnKeyboard: true,
              headerShown: false,
              tabBarActiveTintColor: "#FFAF3A",
              tabBarItemStyle: {
                backgroundColor: "#020202"
              },
              tabBarStyle: [
                {
                  display: "flex",
                  borderTopWidth:0,
                  height:50
                },
                null
              ]
          })}
        >
          <Tab.Screen
            name="Home"
            options={{ title: t("CHORD_FINDER") }}
            component={ChordFinder}
          />
          <Tab.Screen
            name="ChordPosition"
            options={{ title: t("CHORD_DICTIONNARY") }}
            component={ChordPosition}
          />
        </Tab.Navigator>
          {error &&
          <View style={styles.errorContainer}>
            <View style={styles.error}>
              <FontAwesome5 name="exclamation" size={18} color={"#fff"} style={styles.errorIcon}/>
              <Text style={{color:"#fff"}}>{t("ERROR")}</Text>
              <TouchableOpacity style={styles.errorclose} onPress={()=>closeError()}>
                <FontAwesome5 name="times" size={25} color={"#fff"}/>
              </TouchableOpacity>
              <Animated.View style={{...styles.loaderError, width:errorAnim}}></Animated.View>
            </View>
          </View>
        }
      </NavigationContainer>
  );
}

export default withAccessToStore(AppNavigator);


const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 100,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    width: 45,
    height: 45,
    marginLeft: 10,
  },
  footer: {
    backgroundColor: theme.color.headerBackground,
  },
  statusBar: {
    backgroundColor: "red",
  },
  errorContainer:{
    width:"100%",
    height:"100%",
    position:"absolute",
    top: 0,
    left:0,
    justifyContent:"center",
    alignItems:"center",
  },
  error:{
    width:"80%",
    height:150,
    backgroundColor:theme.color.danger,
    borderRadius:10,
    justifyContent:"center",
    alignItems:"center",
    position:"relative"
  },
  errorIcon:{
    borderColor:"#fff",
    borderWidth:1,
    padding:5,
    width:30,
    height:30,
    borderRadius:100,
    textAlign:"center"
  },
  errorclose:{
    position:"absolute",
    top:5,
    right:10,
    opacity:0.8
  },
  loaderError:{
    height:5,
    position:"absolute",
    bottom:0,
    left:2,
    backgroundColor:theme.color.dangerLight,
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
  }
});
