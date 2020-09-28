import React, { useState } from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";
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
  const [selectedImage, changeSelectedImage] = useState(0);

  const image0 = require("./assets/guitarHead0.png"),
    image1 = require("./assets/guitarHead1.png"),
    image2 = require("./assets/guitarHead2.png"),
    image3 = require("./assets/guitarHead3.png"),
    image4 = require("./assets/guitarHead4.png"),
    image5 = require("./assets/guitarHead5.png"),
    image6 = require("./assets/guitarHead6.png"),
    images = [image0, image1, image2, image3, image4, image5, image6];

  return (
    <View style={styles.container}>
      {images.map((image, i) => (
        <Image
          key={i}
          style={styles.background}
          source={image}
          style={
            selectedImage === i
              ? styles.background
              : { ...styles.background, opacity: 0 }
          }
        />
      ))}

      {guitarStrings.map((string) => {
        let inputStyle = [styles.caseInput];
        string.key <= 3
          ? inputStyle.push(styles.caseRight)
          : inputStyle.push(styles.caseLeft);
        (string.key === 3 || string.key === 4) &&
          inputStyle.push(styles.caseTop);
        (string.key === 2 || string.key === 5) &&
          inputStyle.push(styles.caseMid);
        (string.key === 1 || string.key === 6) &&
          inputStyle.push(styles.caseBottom);

        return (
          <Input
            style={inputStyle}
            key={string.key}
            placeholder={string.name + " string"}
            type="decimal-pad"
            placeholderTextColor="#9FA5AA"
            value={string.value}
            onFocus={() => {
              changeSelectedImage(string.key);
            }}
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
      <View style={styles.bottomActions}>
        <Button
          onPress={() => {
            changeSelectedImage(0);
            let chord = "";
            let stringsCopy = guitarStrings.slice().reverse();
            stringsCopy.forEach((string) => {
              chord += string.value ? string.value : "X";
              string.key != 1 && (chord += "-");
            });
            fetch("https://api.uberchord.com/v1/chords?voicing=" + chord)
              .then((response) => response.json())
              .then((data) => {
                changeChord(data[0]);
              });
          }}
        >
          find chord
        </Button>
        <Text h1>{chordResult ? chordResult.chordName : ""}</Text>
      </View>
    </View>
  );
}

const screenHeight = Math.round(Dimensions.get("window").height),
  styles = StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",
      backgroundColor: "#fff",
      alignItems: "center",
    },
    background: {
      width: "50%",
      height: (40 / 100) * screenHeight,
      position: "absolute",
      top: 100,
    },
    caseInput: {
      width: "25%",
      position: "absolute",
    },
    caseRight: {
      right: "-47%",
    },
    caseLeft: {
      left: "-47%",
    },
    caseTop: { top: 100 },
    caseMid: { top: 200 },
    caseBottom: { top: 300 },
    bottomActions: {
      position: "absolute",
      bottom: 0,
      alignItems: "center",
    },
  });
