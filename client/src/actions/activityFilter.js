import { ACTIVITY_FILTER } from "./index";

export function activityFilter(payload) {
  return function (dispatch) {
    dispatch({ type: ACTIVITY_FILTER, payload: payload });
  };
}
