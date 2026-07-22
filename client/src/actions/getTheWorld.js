import { WORLD } from "./index";
import axios from "axios";
import { CALL } from "../Variables";

export function getTheWorld() {
  return async function (dispatch) {
    try {
      const call = await axios.get(CALL.MAIN + "?limit=250");
      dispatch({ type: WORLD, payload: call.data });
    } catch (e) {
      console.log("¡el llamado de getTheWorld fallo!");
    }
  };
}
