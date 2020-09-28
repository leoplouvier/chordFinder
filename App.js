import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Input, Text } from "galio-framework";

export default function App() {
  const [guitarStrings, selectCase] = useState([
    { name: "E", value: "", key: 1 },
    { name: "B", value: "", key: 2 },
    { name: "G", value: "", key: 3 },
    { name: "D", value: "", key: 4 },
    { name: "A", value: "", key: 5 },
    { name: "E", value: "", key: 6 },
  ]);
  const [chordResult, changeChord] = useState({});

  return (
    <View style={styles.container}>
      {guitarStrings.map((string) => {
        return (
          <Input
            key={string.key}
            placeholder={string.name + " string"}
            type="decimal-pad"
            placeholderTextColor="#9FA5AA"
            value={string.value}
            onChangeText={(text) => {
              let valuesToReplace = guitarStrings.map((s) =>
                s.key === string.key
                  ? { name: s.name, value: text, key: s.key }
                  : s
              );
              selectCase(valuesToReplace);
            }}
          />
        );
      })}
      <Button
        onPress={() => {
          let chord = "";
          let stringsCopy = guitarStrings.slice().reverse();
          stringsCopy.forEach((string) => {
            console.log(string.key);
            chord += string.value ? string.value : "X";
            string.key != 1 && (chord += "-");
          });
          console.log(chord);
          fetch("https://api.uberchord.com/v1/chords?voicing=" + chord)
            .then((response) => response.json())
            .then((data) => {
              changeChord(data[0]);
            });
        }}
      >
        find chord
      </Button>
      <Text>{chordResult ? chordResult.chordName : ""}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
