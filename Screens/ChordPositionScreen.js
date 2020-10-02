import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { chordTranslation, theme } from "../utils";
import { Button, Text } from "galio-framework";
import ChordText from "../components/ChordText";
import PlaySchema from "../components/PlaySchema";
import Swiper from "react-native-swiper";

const quality = ["maj", "m"];

export default function ChordPosition() {
  const [selectedChord, changeChord] = useState("");
  const [selectedQuality, changeQuality] = useState("maj");
  const [chordResult, changeResult] = useState([]);
  const [isLoading, changeLoading] = useState(false);
  const swiperEl = useRef(null);

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: 10,
        }}
      >
        {[...chordTranslation.us].sort().map((chord, i) => {
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
          marginTop: 30,
          marginBottom: 30,
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
            swiperEl.current && swiperEl.current.scrollTo(1);
            changeResult(formatedData);
            changeLoading(false);
          } catch (error) {
            changeLoading(false);
            console.log(error);
          }
        }}
      >
        How to play
      </Button>
      {chordResult.length > 0 && (
        <Swiper
          containerStyle={{
            width: "100%",
            height: 360,
            position: "absolute",
            top: "100%",
          }}
          ref={swiperEl}
        >
          {chordResult.map((c, index) => {
            return (
              <View
                style={{
                  alignItems: "center",
                  flex: 1,
                }}
                key={index}
              >
                <ChordText
                  root={c.chord.root}
                  quality={c.chord.quality}
                  tension={c.chord.tension}
                />
                <PlaySchema chord={c.strings} />
              </View>
            );
          })}
        </Swiper>
      )}
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
