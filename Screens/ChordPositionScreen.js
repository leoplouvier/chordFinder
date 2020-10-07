import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { chordTranslation, quality, alteration } from "../utils/guitarUtils";
import { theme } from "../utils/styleUtils";
import { Button } from "galio-framework";
import ChordText from "../components/ChordText";
import PlaySchema from "../components/PlaySchema";
import Swiper from "react-native-swiper";
import SelectableButton from "../components/SelectableButton";
import {
  getChordCurrentTranslation,
  withTranslation,
} from "../translationStore";

const ChordPosition = (props) => {
  const [selectedChord, changeChord] = useState(""),
    [selectedQuality, changeQuality] = useState("maj"),
    [selectedAlteration, changeAlteration] = useState(""),
    [chordResult, changeResult] = useState([]),
    [isLoading, changeLoading] = useState(false),
    [cantBeSharp, disableSharp] = useState(false),
    [cantBeFlat, disableFlat] = useState(false),
    swiperEl = useRef(null),
    searchForChords = async () => {
      let chord = chordTranslation.us[selectedChord];
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
    };
  let chordArray =
    props.state.translation === "us"
      ? [...props.state.translationArray].sort()
      : props.state.translationArray;

  return (
    <View>
      <View style={styles.ButtonContainer}>
        {chordArray.map((chord, i) => {
          return (
            <SelectableButton
              key={i}
              isSelected={
                !selectedChord ||
                selectedChord ===
                  props.state.translationArray.findIndex((c) => c === chord)
              }
              textString={chord}
              onPress={() => {
                let chordValue = props.state.translationArray.findIndex(
                  (c) => c === chord
                );
                changeChord(chordValue);
                disableSharp(["E", "B"].includes(chord) ? true : false);
                disableFlat(["F", "C"].includes(chord) ? true : false);
                changeAlteration("");
              }}
            />
          );
        })}
      </View>
      <View style={styles.ButtonContainer}>
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
      <View style={styles.ButtonContainer}>
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
        style={styles.searchButton}
        color={!selectedChord ? theme.color.disabled : theme.color.accent}
        loading={isLoading}
        onPress={searchForChords}
      >
        How to play
      </Button>
      {chordResult.length > 0 && (
        <Swiper containerStyle={styles.swiperContainer} ref={swiperEl}>
          {chordResult.map((c, index) => {
            return (
              <View style={styles.swiperViewContainer} key={index}>
                <ChordText
                  root={getChordCurrentTranslation(c.chord.root)}
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
};

export default withTranslation(ChordPosition);

const styles = StyleSheet.create({
  ButtonContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 15 },
  searchButton: { marginTop: 15 },
  swiperContainer: {
    width: "100%",
    height: 360,
    position: "absolute",
    top: "100%",
  },
  swiperViewContainer: {
    alignItems: "center",
    flex: 1,
  },
});
