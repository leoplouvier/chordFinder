import React, { useState, useRef } from "react";
import { View, StyleSheet, Pressable, Animated, Easing } from "react-native";
import { Text } from "galio-framework";
import { theme } from "../utils/styleUtils";
import { withAccessToStore, changeTranslation } from "../redux/store";

const TranslationSwitch = () => {
  const [translationEU, setTranslation] = useState(false);
  const translateAnim = useRef(new Animated.Value(2)).current;
  const translate = (shouldBeEU) => {
      setTranslation(shouldBeEU)
      Animated.timing(translateAnim, {
        toValue: shouldBeEU ? 58 : 2,
        duration: 500,
        easing: Easing.in(),
        useNativeDriver: false,
      }).start(() => {
        changeTranslation(shouldBeEU);
      });
    };
  return (
    <View style={styles.translationContainer}>
      <Animated.View style={{...styles.bar, left: translateAnim}}></Animated.View>
      <Pressable onPress={() => translate(false) }>
        <Text
          style={ !translationEU ? {...styles.activeTranslation,marginLeft:13} : {...styles.passiveTranslation,marginLeft:13} }
        >
          A B C
        </Text>
      </Pressable>
      <Pressable onPress={() => translate(true) }>
      <Text
        style={
          translationEU ? {...styles.activeTranslation,marginRight:6} : {...styles.passiveTranslation,marginRight:8}
        }
      >
        Do Re Mi
      </Text>
      </Pressable>
    </View>
  );
};

export default withAccessToStore(TranslationSwitch);

const styles = StyleSheet.create({
  translationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor:theme.color.background,
    borderWidth:1,
    borderColor:theme.color.primary,
    width:120,
    height:30,
    borderRadius:20,
    position:"relative",
  },
  bar:{
    backgroundColor:theme.color.primary,
    width:"50%",
    height:"85%",
    borderRadius:20,
    position:"absolute",
  },
  translationSwitch: {
    transform: [{ scale: 1.5 }],
  },
  activeTranslation: {
    color: theme.color.background,
    fontSize: 12
  },
  passiveTranslation: {
    color: theme.color.primary,
    fontSize: 10
  }
});


