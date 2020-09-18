const ACTION_GET_USER = "ACTION_GET_USER";

export const getUser = (token) => (dispatch) => {
  dispatch({ type: ACTION_GET_USER, payload: "hola!!!" });
};
