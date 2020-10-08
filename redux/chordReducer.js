//REDUCER
const initialState = {};
export const chordReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHANGE_CHORD":
      return action.chord;
    default:
      return state;
  }
};
