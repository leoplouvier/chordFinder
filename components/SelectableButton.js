import React from "react";
import { Text, Button } from "galio-framework";
import { theme } from "../utils/styleUtils";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Dimensions } from "react-native";

export default function SelectableButton(props) {
  const getColor = () => {
      return props.isSelected
        ? theme.color.primary
        : theme.color.background;
    },
    getTextColor = () => {
      return props.isSelected 
      ? theme.color.background
      : props.disabled
      ? theme.color.inactive
      : "#fff";
    };
  return (
    <Button
      style={{
        width: props.width || props.byLine ? (100/props.byLine) + "%" : 60,
        height: props.height || Math.min(Dimensions.get('window').height* 0.05,40),
        opacity : props.isSelected ? 1 : 0.7, 
        margin: 0,
        borderRadius:0,
        backgroundColor: props.isSelected ? theme.color.primary : theme.color.background,
        borderColor: getColor(),
        shadowColor:theme.color.background,
      }}
      onPress={props.onPress}
      disabled={props.disabled}
    >
      {props.icon ? (
        <FontAwesome5 name={props.icon} size={25} color={getTextColor()} />
      ) : (
        <Text style={{ color: getTextColor()}}>{props.textString}</Text>
      )}
    </Button>
  );
}