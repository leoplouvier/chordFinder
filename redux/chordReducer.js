//REDUCER
const initialState = {error:false};
export const chordReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHANGE_CHORD":
      return {...initialState, ...action.chord};
    case "REMOVE_CHORD":
      return initialState;
    case "SET_CHORD_ERROR":
      return {...state, error:action.error};
    default:
      return state;
  }
};
