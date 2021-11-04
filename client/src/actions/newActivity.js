import { ADD } from "./index";
import axios from "axios";
import { CALL } from "../Variables";

export function newActivity(payload) {
  return async function (dispatch) {
    try {
      const call = await axios.post(CALL.NEW, payload);
      dispatch({ type: ADD, payload: call.data });
    } catch (e) {
      alert("El llamado de newActivity fallo, reacer formulario");
    }
  };
}
