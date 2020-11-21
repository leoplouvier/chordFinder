import React, { useState } from "react";
import { View, StyleSheet, Switch } from "react-native";
import { Text } from "galio-framework";
import { theme } from "../utils/styleUtils";
import { withAccessToStore, changeTranslation } from "../redux/store";

const TranslationSwitch = (props) => {
  const [translationEU, setTranslation] = useState(false),
    translate = () => {
      changeTranslation();
      setTranslation(!translationEU);
    };
  return (
    <View style={styles.translationContainer}>
      <Text
        style={
          !translationEU ? styles.activeTranslation : styles.passiveTranslation
        }
      >
        A,B,C,...
      </Text>
      <Switch
        style={styles.translationSwitch}
        trackColor={{
          false: theme.color.inactive,
          true: theme.color.primary,
        }}
        thumbColor={theme.color.white}
        ios_backgroundColor="#3e3e3e"
        onValueChange={translate}
        value={translationEU}
      />
      <Text
        style={
          translationEU ? styles.activeTranslation : styles.passiveTranslation
        }
      >
        Do,Ré,Mi,...
      </Text>
    </View>
  );
};

export default withAccessToStore(TranslationSwitch);

const styles = StyleSheet.create({
  translationContainer: {
    position: "absolute",
    top: 45,
    right: 0,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  translationSwitch: {
    transform: [{ scale: 1.5 }],
  },
  activeTranslation: {
    color: theme.color.primary,
    paddingLeft: 10,
    paddingRight: 10,
  },
  passiveTranslation: {
    color: "#9FA5AA",
    paddingLeft: 10,
    paddingRight: 10,
  },
});
