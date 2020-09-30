import React from "react";
import { View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChordFinder from "./Screens/ChordFinderScreen";
import ChordPosition from "./Screens/ChordPositionScreen";
import { Icon, Text } from "galio-framework";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.header}>
        <Text h5>Chord Finder</Text>
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
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 80,
    borderBottomColor: "#D8DBDD",
    borderBottomWidth: 1,
    paddingLeft: 20,
    paddingTop: 20,
    justifyContent: "center",
  },
});
