import React, { useState } from "react";
import { View } from "react-native";
import { chordTranslation, theme } from "../utils";
import { Button, Text } from "galio-framework";
import ChordText from "../components/ChordText";

const quality = ["maj", "m"];

export default function ChordPosition() {
  const [selectedChord, changeChord] = useState("");
  const [selectedQuality, changeQuality] = useState("maj");
  const [chordResult, changeResult] = useState([]);
  const [isLoading, changeLoading] = useState(false);

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: 10,
        }}
      >
        {chordTranslation.us.sort().map((chord, i) => {
          return (
            <SelectableButton
              key={i}
              isSelected={!selectedChord || selectedChord === chord}
              textString={chord}
              onPress={() => changeChord(chord)}
            />
          );
        })}
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: 50,
          marginBottom: 50,
        }}
      >
        {quality.map((q) => {
          return (
            <SelectableButton
              key={q}
              isSelected={!selectedQuality || selectedQuality === q}
              textString={q}
              onPress={() => changeQuality(q)}
            />
          );
        })}
      </View>
      <Button
        disabled={!selectedChord}
        color={!selectedChord ? theme.color.disabled : theme.color.accent}
        loading={isLoading}
        onPress={async () => {
          let chord = selectedChord;
          selectedQuality && (chord += "_" + selectedQuality);
          changeLoading(true);
          try {
            let response = await fetch(
                "https://api.uberchord.com/v1/chords?nameLike=" + chord
              ),
              data = await response.json();
            let formatedData = data.map((d) => {
              let chordArray = d.chordName.split(",");
              return {
                ...d,
                chord: {
                  root: chordArray[0],
                  quality: chordArray[1],
                  tension: chordArray[2],
                },
              };
            });
            changeResult(formatedData);
            changeLoading(false);
          } catch (error) {
            console.log(error);
          }
        }}
      >
        How to play
      </Button>
      {chordResult.length > 0 &&
        chordResult.map((c, index) => {
          return (
            <View style={{ alignItems: "center" }} key={index}>
              <ChordText
                root={c.chord.root}
                quality={c.chord.quality}
                tension={c.chord.tension}
              />
              <Text h4>{c.strings}</Text>
            </View>
          );
        })}
    </View>
  );
}

const SelectableButton = (props) => {
  return (
    <Button
      style={{
        width: 80,
      }}
      color={props.isSelected ? theme.color.primary : "#fff"}
      onPress={props.onPress}
    >
      <Text
        style={{
          color: props.isSelected ? "#fff" : theme.color.primary,
        }}
      >
        {props.textString}
      </Text>
    </Button>
  );
};
