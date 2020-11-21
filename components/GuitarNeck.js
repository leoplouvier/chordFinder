import React, { useState } from "react";
import { ScrollView, Image, View } from "react-native";
import { Button, Text } from "galio-framework";
import { theme } from "../utils/styleUtils";
import { changeChord, withAccessToStore } from "../redux/store";

const GuitarNeck = (props) => {
  const init =
      props.state.chord && props.state.chord.strings
        ? props.state.chord.strings.split(" ")
        : ["X", "X", "X", "X", "X", "X"],
    [neckCases, changeNeck] = useState(init),
    neck = props.image,
    help = [1, 3, 5, 7, 9, 12, 15, 17, 19, 21],
    cases = [];
  for (let i = 0; i < 6; i++) {
    let stringArray = [];
    for (let j = 0; j < 22; j++) {
      stringArray.push(0);
    }
    cases.push(stringArray);
  }
  const findChord = async () => {
    let chord = "";
    neckCases.forEach((c, index) => {
      chord += index == 0 ? c : "-" + c;
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
      changeChord({ ...data[0], chordObj });
      props.onPress();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        height: "65%",
      }}
    >
      <ScrollView style={{ width: "100%" }}>
        <Image
          source={neck}
          style={{
            width: "70%",
            marginLeft: "15%",
            resizeMode: "stretch",
          }}
        />
        <View
          style={{
            position: "absolute",
            flexDirection: "row",
            width: "70%",
            left: "15%",
            top: 5,
            paddingLeft: 18,
            paddingRight: 18,
          }}
        >
          {neckCases.map((c, index) => {
            return (
              <View
                key={index + "emptyString"}
                style={{
                  height: [0, 5].includes(index)
                    ? 1960
                    : [1, 4].includes(index)
                    ? 1965
                    : 1975,
                  width: 10 - index,
                  minWidth: 7,
                  backgroundColor:
                    c === "X" ? theme.color.inactive : theme.color.primary,
                  marginRight: 36 + index,
                  opacity: ["0", 0, "X"].includes(c) ? 1 : 0,
                }}
              ></View>
            );
          })}
        </View>
        <View
          style={{
            position: "absolute",
            flexDirection: "row",
            width: "70%",
            left: "15%",
            top: 40,
          }}
        >
          {cases.map((c, index) => {
            return (
              <View key={index}>
                {c.map((string, i) => {
                  return (
                    <Button
                      key={i}
                      color="transparent"
                      shadowless
                      style={{
                        width: 46,
                        height: getCasesHeight(i),
                        margin: 0,
                      }}
                      onPress={() => {
                        let oldNeckState = [...neckCases];
                        oldNeckState[index] = i + 1;
                        changeNeck(oldNeckState);
                      }}
                    >
                      {neckCases[index] == i + 1 ? (
                        <View
                          style={{
                            width: 25,
                            height: 25,
                            borderRadius: 25,
                            backgroundColor: theme.color.primary,
                          }}
                        ></View>
                      ) : (
                        <View></View>
                      )}
                    </Button>
                  );
                })}
              </View>
            );
          })}
        </View>
        <View
          style={{
            position: "absolute",
            left: 0,
            top: 40,
          }}
        >
          {help.map((h) => {
            return (
              <View
                key={h + "help"}
                style={{ marginTop: getHelpTop(h), alignItems: "center" }}
              >
                <Text h3> {h} </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View
        style={{ position: "absolute", bottom: -143, alignItems: "center" }}
      >
        <View style={{ flexDirection: "row" }}>
          {neckCases.map((c, index) => {
            return (
              <View key={index + "action"}>
                <Button
                  color={
                    ["0", 0].includes(c)
                      ? theme.color.primary
                      : theme.color.darkPrimary
                  }
                  style={{
                    width: 30,
                    height: 35,
                    marginTop: 0,
                    marginBottom: 2,
                  }}
                  onPress={() => {
                    let newNeckState = [...neckCases];
                    newNeckState[index] = "0";
                    changeNeck(newNeckState);
                  }}
                >
                  0
                </Button>
                <Button
                  color={
                    c === "X" ? theme.color.inactive : theme.color.darkInactive
                  }
                  style={{
                    width: 30,
                    height: 35,
                    marginTop: 0,
                    marginBottom: 0,
                  }}
                  onPress={() => {
                    let newNeckState = [...neckCases];
                    newNeckState[index] = "X";
                    changeNeck(newNeckState);
                  }}
                >
                  X
                </Button>
              </View>
            );
          })}
        </View>
        <Button
          color={theme.color.primary}
          onPress={findChord}
          style={{ marginTop: 20 }}
        >
          find Chord
        </Button>
      </View>
    </View>
  );
};
const getHelpTop = (help) => {
  switch (help) {
    case 1:
      return 40;
    case 3:
      return 200;
    case 5:
    case 12:
      return 180;
    case 7:
    case 15:
      return 160;
    case 9:
      return 130;
    default:
      return 90;
  }
};
const getCasesHeight = (index) => {
  // DIMENSION en cm des cases
  // 1 & 2 : 2,2
  // 3 & 4 : 2
  // 5 & 6 : 1,8
  // 7 & 8 : 1,6
  // 9 & 10 : 1,4
  // 11 & + : 1,6
  switch (index) {
    case 0:
    case 1:
      return 130;
    case 2:
    case 3:
      return 119;
    case 4:
    case 5:
      return 105;
    case 6:
    case 7:
      return 94;
    case 8:
    case 9:
      return 82;
    default:
      return 70;
  }
};

export default withAccessToStore(GuitarNeck);
