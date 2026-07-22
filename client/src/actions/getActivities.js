import { GET_ACTIVITIES } from "./index";
import axios from "axios";
import { CALL } from "../Variables";

export function getActivities() {
  return async function (dispatch) {
    try {
      const call = await axios.get(CALL.ACTIVITIES);
      dispatch({ type: GET_ACTIVITIES, payload: call.data });
    } catch (e) {
      console.log('getActivities failed');
    }
  };
}
