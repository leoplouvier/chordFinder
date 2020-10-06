import { createStore } from "redux";
import { connect } from "react-redux";
import { chordTranslation } from "./utils";
const initialState = {
  translation: "us",
  translationArray: chordTranslation.us,
};
const translationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHANGE_TRANSLATION":
      return {
        ...state,
        translation: state.translation === "us" ? "eu" : "us",
        translationArray:
          state.translation === "us"
            ? chordTranslation.eu
            : chordTranslation.us,
      };
    default:
      return state;
  }
};

export const store = createStore(translationReducer);

export const changeTranslation = () =>
  store.dispatch({ type: "CHANGE_TRANSLATION" });

const mapStateToProps = (state, ...props) => {
  return {
    ...props,
    state,
  };
};

export const withTranslation = (component) => {
  return connect(mapStateToProps, null)(component);
};

export const getChordCurrentTranslation = (chord) => {
  let index = chordTranslation.us.findIndex((c) => c === chord);
  index == -1 && (index = chordTranslation.eu.findIndex((c) => c === chord));

  return store.getState().translationArray[index];
};
