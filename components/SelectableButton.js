import React from "react";
import { StyleSheet } from "react-native";
import { Text, Button, Icon } from "galio-framework";
import { theme } from "../utils/styleUtils";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default function SelectableButton(props) {
  const getColor = () => {
      return props.isSelected
        ? theme.color.primary
        : props.disabled
        ? theme.color.disabled
        : "#fff";
    },
    getTextColor = () => {
      return props.isSelected ? "#fff" : theme.color.inactive;
    };
  return (
    <Button
      style={{
        width: props.width || 60,
        height: props.height || 40,
      }}
      color={getColor()}
      onPress={props.onPress}
      disabled={props.disabled}
    >
      {props.icon ? (
        <FontAwesome5 name={props.icon} size={25} color={getTextColor()} />
      ) : (
        <Text style={{ color: getTextColor() }}>{props.textString}</Text>
      )}
    </Button>
  );
}
const styles = StyleSheet.create({
  activeButton: {},
});
