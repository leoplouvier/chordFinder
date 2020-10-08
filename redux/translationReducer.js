import { chordTranslation } from "../utils/guitarUtils";

//REDUCER
const initialState = {
  translation: "us",
  translationArray: chordTranslation.us,
};
export const translationReducer = (state = initialState, action) => {
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
