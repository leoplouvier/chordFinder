import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "galio-framework";

export default function ChordText(props) {
  const findAlteration = (chordStr) => {
      return chordStr.includes("b") ? "b" : chordStr.includes("#") ? "#" : "";
    },
    alteration = props.root ? findAlteration(props.root) : "",
    root = alteration ? props.root.split(alteration)[0] : props.root;
  return (
    <View style={styles.chordContainer}>
      <Text h1>{root}</Text>
      <Text h3 style={{ marginBottom: 10 }}>
        {alteration}
      </Text>
      <Text h6 style={{ marginTop: 30 }}>
        {props.quality}
      </Text>
      <Text h5 style={{ marginBottom: 10 }}>
        {props.tension}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chordContainer: { flexDirection: "row", alignItems: "center" },
});
