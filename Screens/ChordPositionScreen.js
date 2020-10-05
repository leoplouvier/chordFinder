import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { chordTranslation, theme } from "../utils";
import { Button, Text } from "galio-framework";
import ChordText from "../components/ChordText";
import PlaySchema from "../components/PlaySchema";
import Swiper from "react-native-swiper";

const quality = ["maj", "m"],
  alteration = ["b", "", "#"];

export default function ChordPosition() {
  const [selectedChord, changeChord] = useState("");
  const [selectedQuality, changeQuality] = useState("maj");
  const [selectedAlteration, changeAlteration] = useState("");
  const [chordResult, changeResult] = useState([]);
  const [isLoading, changeLoading] = useState(false);
  const [cantBeSharp, disableSharp] = useState(false);
  const [cantBeFlat, disableFlat] = useState(false);
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
              onPress={() => {
                changeChord(chord);
                disableSharp(["E", "B"].includes(chord) ? true : false);
                disableFlat(["F", "C"].includes(chord) ? true : false);
                changeAlteration("");
              }}
            />
          );
        })}
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: 15,
          marginBottom: 15,
          width: "100%",
        }}
      >
        {alteration.map((a) => {
          return (
            <SelectableButton
              width={40}
              key={a}
              isSelected={selectedAlteration === a}
              textString={!a ? "--" : a}
              onPress={() => changeAlteration(a)}
              disabled={
                a === "#" ? cantBeSharp : a === "b" ? cantBeFlat : false
              }
            />
          );
        })}
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          marginBottom: 15,
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
          selectedAlteration &&
            (chord +=
              selectedAlteration && selectedAlteration === "#"
                ? "%23"
                : selectedAlteration);
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
        width: props.width || 60,
        height: props.height || 40,
      }}
      color={
        props.isSelected
          ? theme.color.primary
          : props.disabled
          ? theme.color.disabled
          : "#fff"
      }
      onPress={props.onPress}
      disabled={props.disabled}
    >
      <Text
        style={{
          color: props.isSelected
            ? "#fff"
            : props.disabled
            ? theme.color.inactive
            : theme.color.primary,
        }}
      >
        {props.textString}
      </Text>
    </Button>
  );
};
