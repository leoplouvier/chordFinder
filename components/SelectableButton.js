import React from "react";
import { Text, Button } from "galio-framework";
import { theme } from "../utils/styleUtils";

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
}
