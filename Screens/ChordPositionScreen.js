import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { chordTranslation, quality, alteration } from "../utils/guitarUtils";
import { theme } from "../utils/styleUtils";
import { Button } from "galio-framework";
import ChordText from "../components/ChordText";
import PlaySchema from "../components/PlaySchema";
import Swiper from "react-native-swiper";
import SelectableButton from "../components/SelectableButton";
import { getChordCurrentTranslation, withAccessToStore } from "../redux/store";
import { getPositionWithChord } from "../services/httpService";
import { useTranslation } from "react-i18next";

const ChordPosition = (props) => {
  const { t, i18n } = useTranslation(),
    [selectedChord, changeChord] = useState(""),
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
      let positionResult = await getPositionWithChord(chord);
      if (positionResult) {
        swiperEl.current && swiperEl.current.scrollTo(1);
        changeResult(positionResult);
      }
      changeLoading(false);
    };
  let chordArray =
    props.state.translation.translation === "us"
      ? [...props.state.translation.translationArray].sort()
      : props.state.translation.translationArray;

  return (
    <View style={styles.container}>
      <View style={styles.ButtonContainer}>
        {chordArray.map((chord, i) => {
          return (
            <SelectableButton
              key={i}
              isSelected={
                selectedChord === "" ||
                selectedChord ===
                  props.state.translation.translationArray.findIndex(
                    (translatedChord) => translatedChord === chord
                  )
              }
              textString={chord}
              onPress={() => {
                let chordValue = props.state.translation.translationArray.findIndex(
                  (translatedChord) => translatedChord === chord
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
        disabled={selectedChord === ""}
        style={styles.searchButton}
        color={selectedChord === "" ? theme.color.disabled : theme.color.accent}
        loading={isLoading}
        onPress={searchForChords}
      >
        {t("HOW_TO_PLAY")}
      </Button>
      {chordResult.length > 0 && (
        <Swiper
          containerStyle={styles.swiperContainer}
          ref={swiperEl}
          dotColor="#fff"
          activeDotColor={theme.color.primary}
        >
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

export default withAccessToStore(ChordPosition);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.color.background,
    height: "100%",
  },
  ButtonContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 15 },
  searchButton: { marginTop: 15 },
  swiperContainer: {
    width: "100%",
    height: 360,
    position: "absolute",
    top: "49%",
  },
  swiperViewContainer: {
    alignItems: "center",
    flex: 1,
  },
});
