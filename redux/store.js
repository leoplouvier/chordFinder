import { combineReducers, createStore } from "redux";
import { connect } from "react-redux";
import { translationReducer } from "./translationReducer";
import { chordReducer } from "./chordReducer";
import { chordTranslation } from "../utils/guitarUtils";

export const store = createStore(
  combineReducers({ translation: translationReducer, chord: chordReducer })
);

//ACTIONS
export const changeChord = (chord) => {
  store.dispatch({ type: "CHANGE_CHORD", chord });
};
export const changeTranslation = () =>
  store.dispatch({ type: "CHANGE_TRANSLATION" });

//WITH ACCESS TO STORE
const mapStateToProps = (state, ...props) => {
  return {
    ...props,
    state,
  };
};
export const withAccessToStore = (component) => {
  return connect(mapStateToProps, null)(component);
};

//METHODS
export const getChordCurrentTranslation = (chord) => {
  if (!chord) {
    return;
  }
  let chordHighness = chord[chord.length - 1],
    isModified = ["#", "b"].includes(chordHighness),
    chordStr = isModified ? chord.slice(0, chord.length - 1) : chord,
    index = chordTranslation.us.findIndex((c) => c === chordStr);
  index == -1 && (index = chordTranslation.eu.findIndex((c) => c === chordStr));

  let result = store.getState().translation.translationArray[index];
  return isModified ? result + chordHighness : result;
};
