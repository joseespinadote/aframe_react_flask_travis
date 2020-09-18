const initialState = { token: "" };

function counterReducer(state = initialState, action) {
  if (action.type === "ACTION_GET_USERS") {
    return {
      ...state,
      token: action.payload,
    };
  }
  return state;
}
