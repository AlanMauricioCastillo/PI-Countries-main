import { GET_BY_NAME } from "./index";
import axios from "axios";
import { CALL } from "../Variables";

export function getFromName(name) {
  return async function (dispatch) {
    try {
      const call = await axios.get(CALL.BY_NAME + name + "&limit=250");
      const data = call.data.items ? call.data.items : call.data;
      data.forEach(function (e) { e.flag = e.flag_url || e.flag || ""; });
      dispatch({ type: GET_BY_NAME, payload: data });
    } catch (e) {
      alert("non-existent country!");
    }
  };
}
