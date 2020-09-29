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
    ]),
    [chordResult, changeChord] = useState({}),
    [selectedImage, changeSelectedImage] = useState(0),
    [disableFind, changeDisableFind] = useState(true),
    images = [
      require("./assets/guitarHead0.png"),
      require("./assets/guitarHead1.png"),
      require("./assets/guitarHead2.png"),
      require("./assets/guitarHead3.png"),
      require("./assets/guitarHead4.png"),
      require("./assets/guitarHead5.png"),
      require("./assets/guitarHead6.png"),
    ];

  const findChord = async () => {
    let chord = "",
      stringsCopy = guitarStrings.slice().reverse();

    stringsCopy.forEach((string) => {
      chord += string.value ? string.value : "X";
      string.key != 1 && (chord += "-");
    });

    let response = await fetch(
        "https://api.uberchord.com/v1/chords?voicing=" + chord
      ),
      data = await response.json(),
      chordStr = data[0].chordName.split(","),
      chordObj = {
        root: chordStr[0],
        quality: chordStr[1],
        tension: chordStr[2],
        bass: chordStr[3],
      };
    changeChord(chordObj);
  };

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
            onFocus={() => changeSelectedImage(string.key)}
            onChangeText={(text) => {
              let allEmpty = !text,
                valuesToReplace = guitarStrings.map((s) => {
                  allEmpty &&
                    s.key !== string.key &&
                    s.value !== "" &&
                    (allEmpty = false);
                  return s.key === string.key
                    ? { name: s.name, value: text, key: s.key }
                    : s;
                });
              changeDisableFind(allEmpty);
              selectCase(valuesToReplace);
            }}
          />
        );
      })}
      <View style={styles.bottomActions}>
        {disableFind ? (
          <Button color={"#E2E4E5"} opacity={0.2} disabled>
            find chord
          </Button>
        ) : (
          <Button onPress={findChord} disabled={disableFind}>
            find chord
          </Button>
        )}
        {chordResult ? (
          <View style={styles.chordContainer}>
            <Text h1>{chordResult.root}</Text>
            <Text h5 style={{ marginTop: 30 }}>
              {chordResult.quality}
            </Text>
            <Text h4 style={{ marginBottom: 10 }}>
              {chordResult.tension}
            </Text>
          </View>
        ) : (
          ""
        )}
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
    chordContainer: { flexDirection: "row", alignItems: "center" },
  });
