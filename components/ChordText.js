import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "galio-framework";

export default function ChordText(props) {
  return (
    <View style={styles.chordContainer}>
      <Text h1>{props.root}</Text>
      <Text h5 style={{ marginTop: 30 }}>
        {props.quality}
      </Text>
      <Text h4 style={{ marginBottom: 10 }}>
        {props.tension}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chordContainer: { flexDirection: "row", alignItems: "center" },
});
