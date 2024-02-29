import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Text } from "galio-framework";
import { guitarStrings } from "../utils/guitarUtils";
import { getChordCurrentTranslation } from "../redux/store";

export default function PlaySchema(props) {
  let chordArray = props.chord.split(" ").reverse(),
    beginning = 28;
  let positionArray = [];
  chordArray.forEach((pos) => {
    pos !== "X" &&
      Number(pos) < beginning &&
      Number(pos) !== 0 &&
      (beginning = Number(pos));
  });
  for (let i = 0; i < 6; i++) {
    let caseArray = [".", ".", ".", ".", "."];
    if (chordArray[i] !== "X") {
      chordArray[i] == 0
        ? (caseArray[0] = 0)
        : (caseArray[Number(chordArray[i]) + 1 - beginning] = chordArray[i]);
    } else {
      caseArray[0] = "X";
    }
    positionArray.push(caseArray);
  }
  return (
    <View style={styles.stringContainer}>
      {positionArray.map((string, i) => {
        return (
          <View
            style={
              i !== 5
                ? styles.stringSchema
                : {
                    ...styles.stringSchema,
                    borderBottomWidth: 0,
                    borderRightWidth: 0,
                    borderLeftWidth: 0,
                    paddingLeft: 8,
                  }
            }
            key={i}
          >
            {string.map((position, pIndex) => {
              return (
                <View
                  key={pIndex}
                  style={
                    i !== 5
                      ? pIndex !== 4
                        ? styles.positionSchema
                        : { ...styles.positionSchema, opacity: 0 }
                      : {
                          ...styles.positionSchema,
                          borderWidth: 0,
                        }
                  }
                >
                  {position === "X" ? (
                    <View>
                      <Text
                        h4
                        style={styles.xPosition}
                      >
                        X
                      </Text>
                    </View>
                  ) : (
                    position !== "." && (
                      <View
                        style={
                          pIndex === 0
                            ? {
                                ...styles.position,
                                backgroundColor: "init",
                                borderWidth: 1,
                                borderRadius: 25,
                                borderColor: "#fff",
                              }
                            : styles.position
                        }
                      ></View>
                    )
                  )}
                </View>
              );
            })}
          </View>
        );
      })}
      <View style={styles.beginning}>
        <Text h4 style={styles.beginningText}>
          {beginning}
        </Text>
      </View>
      <View style={styles.stringNames}>
        {guitarStrings.map((string, i) => {
          return (
            <Text key={i} muted style={styles.stringNameText}>
              {getChordCurrentTranslation(string)}
            </Text>
          );
        })}
      </View>
    </View>
  );
}
const windowHeight = Dimensions.get('window').height
const schemaWidth = windowHeight < 650 ? 250 : 280
const styles = StyleSheet.create({
  stringContainer: {
    width: schemaWidth,
    alignItems: "center",
    marginLeft: 50,
  },
  stringSchema: {
    width: schemaWidth,
    height:  windowHeight < 650 ? 30 : 40,
    borderLeftWidth: 8,
    borderColor: "#fff",
    marginBottom: 0,
    flexDirection: "row",
  },
  positionSchema: {
    width: schemaWidth/5 - 1,
    height: "100%",
    borderWidth: 1,
    borderColor: "#fff",
  },
  position: {
    width: windowHeight < 650 ? 20 : 25,
    height: windowHeight < 650 ? 20 : 25,
    borderRadius: 25,
    backgroundColor: "#fff",
    marginLeft: windowHeight < 650 ? -35 : -40,
    marginTop: windowHeight < 650 ? -10 : -12,
  },
  xPosition:{
    marginLeft: windowHeight < 650 ? -30 : -37,
    marginTop: windowHeight < 650 ? -20 : -25,
    color: "#fff",
  },
  beginning: {
    position: "absolute",
    bottom: -5,
    left: 0,
    width: 65,
    alignItems: "center",
  },
  beginningText: {
    color: "#fff",
  },
  stringNames: {
    position: "absolute",
    top: -10,
    right: -60,
    width: 100,
    height: "100%",
  },
  stringNameText: {
    marginBottom: windowHeight < 650 ? 11 : 21 
  }
});
