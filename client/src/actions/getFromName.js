import { GET_BY_NAME } from "./index";
import axios from "axios";
import { CALL } from "../Variables";

export function getFromName(name) {
  return async function (dispatch) {
    try {
      const call = await axios.get(CALL.BY_NAME + name);
      dispatch({ type: GET_BY_NAME, payload: call.data });
    } catch (e) {
      alert("non-existent country!");
    }
  };
}
