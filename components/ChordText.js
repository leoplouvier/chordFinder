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
      <Text h1 style={styles.h1}>
        {root}
      </Text>
      <Text h3 style={styles.h3}>
        {alteration}
      </Text>
      <Text h6 style={styles.h6}>
        {props.quality}
      </Text>
      <Text h5 style={styles.h5}>
        {props.tension}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chordContainer: { flexDirection: "row", alignItems: "center" },
  h1: { color: "#fff" },
  h3: { color: "#fff", marginBottom: 10 },
  h5: { color: "#fff", marginBottom: 10 },
  h6: { color: "#fff", marginTop: 30 },
});
