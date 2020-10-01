import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "galio-framework";

export default function PlaySchema(props) {
  let chordArray = props.chord.split(" ").reverse(),
    beginning = 28;
  let positionArray = [];
  chordArray.forEach((pos) => {
    pos !== "X" && Number(pos) < beginning && (beginning = Number(pos));
  });
  beginning == 0 && (beginning = 1);
  for (let i = 0; i < 6; i++) {
    let caseArray = [".", ".", ".", ".", "."];
    if (chordArray[i] !== "X") {
      caseArray[Number(chordArray[i]) + 1 - beginning] = chordArray[i];
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
                      <Text h4 style={{ marginLeft: -35, marginTop: -25 }}>
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
      <Text h3 style={{ position: "absolute", bottom: -20, left: 15 }}>
        {beginning}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stringContainer: {
    width: 280,
    alignItems: "center",
    marginLeft: 50,
  },
  stringSchema: {
    width: 280,
    height: 40,
    borderLeftWidth: 8,
    borderColor: "#000",
    marginBottom: 0,
    flexDirection: "row",
  },
  positionSchema: {
    width: 55,
    height: "100%",
    borderWidth: 1,
  },
  position: {
    width: 25,
    height: 25,
    borderRadius: 25,
    backgroundColor: "#000",
    marginLeft: -40,
    marginTop: -12,
  },
});
