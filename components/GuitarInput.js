import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TextInput,
  Text,
} from "react-native";
import { Button } from "galio-framework";
import { theme } from "../utils/styleUtils";
import {
  changeChord,
  getChordCurrentTranslation,
  removeChord,
  withAccessToStore,
} from "../redux/store";
import { getChordWithPosition } from "../services/httpService";
import { useTranslation } from "react-i18next";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const GuitarInput = (props) => {
  let initString = props.state.chord && props.state.chord.strings
    ? props.state.chord.strings.split(" ")
    : ["", "", "", "", "", ""]
  const [guitarStrings, selectCase] = useState([
      { name: "E", value: initString[5] === "X" ? "" : initString[5], key: 1 },
      { name: "B", value: initString[4] === "X" ? "" : initString[4], key: 2 },
      { name: "G", value: initString[3] === "X" ? "" : initString[3], key: 3 },
      { name: "D", value: initString[2] === "X" ? "" : initString[2], key: 4 },
      { name: "A", value: initString[1] === "X" ? "" : initString[1], key: 5 },
      { name: "E", value: initString[0] === "X" ? "" : initString[0], key: 6 },
    ]),
    [selectedImage, changeSelectedImage] = useState(0),
    [disableFind, changeDisableFind] = useState(true),
    [loadingChord, setloading] = useState(false);
    images = [
      require(".././assets/guitar0.png"),
      require(".././assets/guitar1.png"),
      require(".././assets/guitar2.png"),
      require(".././assets/guitar3.png"),
      require(".././assets/guitar4.png"),
      require(".././assets/guitar5.png"),
      require(".././assets/guitar6.png"),
    ],
    { t, i18n } = useTranslation();

  const findChord = async () => {
      setloading(true)
      let chord = "",
        stringsCopy = guitarStrings.slice().reverse();

      stringsCopy.forEach((string) => {
        chord += string.value ? string.value : "X";
        string.key != 1 && (chord += "-");
      });
      changeSelectedImage(0);
      let chordResponse = await getChordWithPosition(chord);
      if (chordResponse && !chordResponse.error) {
        changeChord(chordResponse);
        props.onFetched && props.onFetched()
      }
      setloading(false)
    },
    clearAll = () => {
      let initArray = guitarStrings.map((string) => {
        return { ...string, value: "" };
      });
      selectCase(initArray);
      changeDisableFind(true);
      removeChord();
    };

    useEffect(()=>{
      const strings = props.state.chord && props.state.chord.strings
      ? props.state.chord.strings.split(" ")
      : ["", "", "", "", "", ""]
      selectCase([
        { name: "E", value: strings[5] === "X" ? "" : strings[5], key: 1 },
        { name: "B", value: strings[4] === "X" ? "" : strings[4], key: 2 },
        { name: "G", value: strings[3] === "X" ? "" : strings[3], key: 3 },
        { name: "D", value: strings[2] === "X" ? "" : strings[2], key: 4 },
        { name: "A", value: strings[1] === "X" ? "" : strings[1], key: 5 },
        { name: "E", value: strings[0] === "X" ? "" : strings[0], key: 6 },
      ])
    },[props.state.chord])

  return (
    <View style={{ ...props.style, ...styles.container }}>
      {images.map((image, i) => (
        <Image
          key={i}
          source={image}
          style={
            selectedImage === i
              ? styles.background
              : { ...styles.background, opacity: 0 }
          }
        />
      ))}
      {guitarStrings.map((string) => {
        let inputStyle = [styles.caseInputContainer];
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
          <View style={inputStyle} key={string.key}>
            {!!string.value && (
              <Text style={styles.caseInputText}>
                {getChordCurrentTranslation(string.name)}
              </Text>
            )}
            <TextInput
              style={styles.caseInput}
              placeholder={getChordCurrentTranslation(string.name)}
              keyboardType="decimal-pad"
              placeholderTextColor={theme.color.gray}
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
          </View>
        );
      })}
      <Button
        onPress={clearAll}
        style={styles.clearButton}
        round
      >
        <FontAwesome5 name="undo" size={25} color={theme.color.accent} />
      </Button>
      <View style={styles.bottomActions}>
        {disableFind ? (
          <Button color={theme.color.disabled} opacity={0.2} disabled>
            {t("FIND_CHORD")}
          </Button>
        ) : (
          <Button
            color={theme.color.primary}
            onPress={findChord}
            disabled={disableFind}
            style={{color:theme.color.background}}
            loading={loadingChord}
            loadingColor={theme.color.background}
          >
           <Text style={{color:theme.color.background}}>{t("FIND_CHORD")}</Text> 
          </Button>
        )}
      </View>
    </View>
  );
};
export default withAccessToStore(GuitarInput);

const screenHeight = Math.round(Dimensions.get("window").height),
  styles = StyleSheet.create({
    container: {
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
      backgroundColor: theme.color.background,
      color: "#fff",
      alignItems: "center",
    },
    background: {
      width: "45%",
      height: 0.6 * screenHeight,
      position: "absolute",
      top: -10,
      zIndex:100
    },
    caseInput: {
      width: 70,
      height: 40,
      borderColor: theme.color.gray,
      borderWidth: 1,
      borderRadius: 5,
      paddingLeft: 10,
      color: "#fff",
    },
    caseInputContainer: {
      position: "absolute",
    },
    caseInputText: {
      position: "absolute",
      top: -20,
      color: theme.color.gray,
    },
    caseRight: {
      right: 20,
    },
    caseLeft: {
      left: 20,
    },
    caseTop: { top: 90 },
    caseMid: { top: 190 },
    caseBottom: { top: 290 },
    bottomActions: {
      marginTop: 520,
      alignItems: "center",
    },
    clearButton: {
      position: "absolute",
      top: 360,
      right: 25,
      width: 50,
      height: 50,
      backgroundColor:theme.color.background,
      borderColor:theme.color.accent,
      borderWidth:1,
    },
  });
