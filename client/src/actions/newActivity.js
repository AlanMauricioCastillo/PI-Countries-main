import { ADD } from "./index";
import axios from "axios";
import { CALL } from "../Variables";

export function newActivity(payload) {
  return async function (dispatch) {
    try {
      const call = await axios.post(CALL.NEW, payload);
      console.log(call.data);
      dispatch({ type: ADD, payload: call.data });
    /* } catch (e) {
      if (e) {
        alert("el llamado de newActivity fallo, reembiando Formulario");
        try {
          const call = await axios.post(CALL.NEW, payload);
          if (call) {
            dispatch({ type: ADD, payload: call.data });
          } */
        } catch (e) {
          alert("segundo llamado de newActivity fallo, reacer formulario");
        }
      }
    }
  //};
//}
