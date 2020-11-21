import React from "react";
import { View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChordFinder from "./screens/ChordFinderScreen";
import ChordPosition from "./screens/ChordPositionScreen";
import { Icon, Text } from "galio-framework";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import TranslationSwitch from "./components/TranslationSwitch";
import { theme } from "./utils/styleUtils";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <View style={styles.header}>
          <Text h5 style={styles.headerTitle}>
            Chord Finder
          </Text>
          <TranslationSwitch />
        </View>
        <Tab.Navigator
          tabBarOptions={{ tabStyle: styles.footer }}
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
    backgroundColor: theme.color.headerBackground,
  },
  headerTitle: {
    color: "#fff",
  },
  footer: {
    backgroundColor: theme.color.headerBackground,
  },
});
