import React, { useState } from "react";
import { View } from "react-native";
import GuitarNeck from "../components/GuitarNeck";
import GuitarInput from "../components/GuitarInput";
import SelectableButton from "../components/SelectableButton";
import { withAccessToStore } from "../redux/store";

const ChordFinder = (props) => {
  const modes = ["InputMode", "NeckMode"],
    [currentMode, changeMode] = useState(modes[0]),
    neckImage = require("../assets/guitarNeck.png");

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        {modes.map((mode, i) => {
          return (
            <SelectableButton
              key={mode}
              isSelected={mode === currentMode}
              textString={mode}
              onPress={() => {
                changeMode(mode);
              }}
            />
          );
        })}
      </View>
      {currentMode === modes[1] ? (
        <GuitarNeck image={neckImage} onPress={() => changeMode(modes[0])} />
      ) : (
        <GuitarInput state={props.state} />
      )}
    </View>
  );
};
export default withAccessToStore(ChordFinder);
