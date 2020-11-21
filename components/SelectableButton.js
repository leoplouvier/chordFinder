import React from "react";
import { Text, Button, Icon } from "galio-framework";
import { theme } from "../utils/styleUtils";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default function SelectableButton(props) {
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
      {props.icon ? (
        <FontAwesome5
          name={props.icon}
          size={25}
          color={props.isSelected ? "#fff" : theme.color.inactive}
        />
      ) : (
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
      )}
    </Button>
  );
}
