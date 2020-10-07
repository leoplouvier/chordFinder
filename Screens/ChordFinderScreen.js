import React, { useState } from "react";
import { StyleSheet, View, Image, Dimensions, TextInput } from "react-native";
import { Button } from "galio-framework";
import { theme } from "../utils/styleUtils";
import ChordText from "../components/ChordText";
import {
  getChordCurrentTranslation,
  withTranslation,
} from "../translationStore";

const ChordFinder = (props) => {
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
      require(".././assets/guitarHead0.png"),
      require(".././assets/guitarHead1.png"),
      require(".././assets/guitarHead2.png"),
      require(".././assets/guitarHead3.png"),
      require(".././assets/guitarHead4.png"),
      require(".././assets/guitarHead5.png"),
      require(".././assets/guitarHead6.png"),
    ];

  const findChord = async () => {
      let chord = "",
        stringsCopy = guitarStrings.slice().reverse();

      stringsCopy.forEach((string) => {
        chord += string.value ? string.value : "X";
        string.key != 1 && (chord += "-");
      });

      try {
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
      } catch (error) {
        console.log(error);
      }
    },
    clearAll = () => {
      let initArray = guitarStrings.map((string) => {
        return { ...string, value: "" };
      });
      selectCase(initArray);
      changeDisableFind(true);
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
          <TextInput
            style={inputStyle}
            key={string.key}
            placeholder={getChordCurrentTranslation(string.name)}
            keyboardType="decimal-pad"
            placeholderTextColor="#9FA5AA"
            value={string.value}
            onFocus={() => changeSelectedImage(string.key)}
            onChangeText={(text) => {
              let numText = Number(text);
              if ((text && !numText && numText !== 0) || numText > 26) {
                return;
              }
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
      <Button
        onPress={clearAll}
        style={styles.clearButton}
        round
        color={theme.color.danger}
      >
        Clear
      </Button>
      <View style={styles.bottomActions}>
        {disableFind ? (
          <Button color={theme.color.disabled} opacity={0.2} disabled>
            find chord
          </Button>
        ) : (
          <Button
            color={theme.color.primary}
            onPress={findChord}
            disabled={disableFind}
          >
            find chord
          </Button>
        )}
        {chordResult ? (
          <ChordText
            root={getChordCurrentTranslation(chordResult.root)}
            quality={chordResult.quality}
            tension={chordResult.tension}
          />
        ) : (
          ""
        )}
      </View>
    </View>
  );
};
export default withTranslation(ChordFinder);

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
      top: 80,
    },
    caseInput: {
      width: "22%",
      position: "absolute",
      height: 40,
      borderColor: "gray",
      borderWidth: 1,
      borderRadius: 5,
      paddingLeft: 10,
    },
    caseRight: {
      right: 10,
    },
    caseLeft: {
      left: 10,
    },
    caseTop: { top: 110 },
    caseMid: { top: 200 },
    caseBottom: { top: 290 },
    bottomActions: {
      position: "absolute",
      bottom: 0,
      alignItems: "center",
    },
    clearButton: {
      position: "absolute",
      top: 350,
      right: 20,
      width: 60,
    },
  });
