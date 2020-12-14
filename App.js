import React, { useState } from "react";
import "./services/translationService";
import { View, StyleSheet, StatusBar, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChordFinder from "./screens/ChordFinderScreen";
import ChordPosition from "./screens/ChordPositionScreen";
import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import TranslationSwitch from "./components/TranslationSwitch";
import { theme } from "./utils/styleUtils";
import { Icon } from "galio-framework";
import { useTranslation } from "react-i18next";

const Tab = createBottomTabNavigator();
function cacheImages(images) {
  return images.map((image) => {
    return Asset.fromModule(image).downloadAsync();
  });
}
export default function App() {
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

  if (!isReady) {
    return (
      <AppLoading
        startAsync={_loadAssetsAsync}
        onFinish={() => setReady(true)}
        onError={console.warn}
      />
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar translucent />
        <View style={styles.header}>
          <Image source={icon} style={styles.headerIcon} />
          <TranslationSwitch />
        </View>
        <Tab.Navigator
          tabBarOptions={{
            keyboardHidesTabBar: true,
            tabStyle: styles.footer,
            activeTintColor: theme.color.primary,
          }}
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
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 90,
    borderBottomColor: "#D8DBDD",
    borderBottomWidth: 1,
    paddingLeft: 20,
    paddingTop: 25,
    justifyContent: "flex-start",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.color.headerBackground,
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
});
