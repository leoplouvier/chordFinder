import React, { useState } from "react";
import { View, StyleSheet, Switch } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChordFinder from "./Screens/ChordFinderScreen";
import ChordPosition from "./Screens/ChordPositionScreen";
import { Icon, Text } from "galio-framework";
import { Provider } from "react-redux";
import { changeTranslation, store } from "./translationStore";
import { theme } from "./utils";

const Tab = createBottomTabNavigator();

export default function App() {
  const [translationEU, setTranslation] = useState(
      store.getState().translation === "eu"
    ),
    translate = () => {
      changeTranslation();
      setTranslation(!translationEU);
    };
  return (
    <Provider store={store}>
      <NavigationContainer>
        <View style={styles.header}>
          <Text h5>Chord Finder</Text>

          <View style={styles.translationContainer}>
            <Text
              style={
                !translationEU
                  ? styles.activeTranslation
                  : styles.passiveTranslation
              }
            >
              A,B,C,...
            </Text>
            <Switch
              style={styles.translationSwitch}
              trackColor={{
                false: theme.color.inactive,
                true: theme.color.primary,
              }}
              thumbColor={theme.color.white}
              ios_backgroundColor="#3e3e3e"
              onValueChange={translate}
              value={translationEU}
            />
            <Text
              style={
                translationEU
                  ? styles.activeTranslation
                  : styles.passiveTranslation
              }
            >
              Do,Ré,Mi,...
            </Text>
          </View>
        </View>
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
          })}
        >
          <Tab.Screen
            name="Home"
            options={{ title: "Chord Finder" }}
            component={ChordFinder}
          />
          <Tab.Screen
            name="ChordPosition"
            options={{ title: "Chord Dictionnary" }}
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
    paddingTop: 20,
    justifyContent: "center",
  },
  translationContainer: {
    position: "absolute",
    top: 45,
    right: 0,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  translationSwitch: {
    transform: [{ scale: 1.5 }],
  },
  activeTranslation: {
    color: "#000",
    paddingLeft: 10,
    paddingRight: 10,
  },
  passiveTranslation: {
    color: "#9FA5AA",
    paddingLeft: 10,
    paddingRight: 10,
  },
});
