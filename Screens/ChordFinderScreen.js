import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import GuitarNeck from "../components/GuitarNeck";
import GuitarInput from "../components/GuitarInput";
import SelectableButton from "../components/SelectableButton";
import { withAccessToStore } from "../redux/store";
import { theme } from "../utils/styleUtils";

const ChordFinder = (props) => {
  const modes = ["InputMode", "NeckMode"],
    [currentMode, changeMode] = useState(modes[0]);

  return (
    <View style={styles.container}>
      <View style={styles.modeSelection}>
        {modes.map((mode, i) => {
          let icon = i == 0 ? "keyboard" : "guitar";
          return (
            <SelectableButton
              key={mode}
              isSelected={mode === currentMode}
              icon={icon}
              onPress={() => {
                changeMode(mode);
              }}
            />
          );
        })}
      </View>
      <GuitarNeck
        style={currentMode === modes[0] ? styles.hidden : {}}
        onPress={() => changeMode(modes[0])}
      />
      <GuitarInput
        style={currentMode === modes[1] ? styles.hidden : {}}
        state={props.state}
      />
    </View>
  );
};
export default withAccessToStore(ChordFinder);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.color.background,
    height: "100%",
  },
  modeSelection: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: theme.color.background,
  },
  hidden: {
    display: "none",
  },
});
