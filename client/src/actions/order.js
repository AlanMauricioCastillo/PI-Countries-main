import { ORDER } from "./index";
import axios from "axios";
import { CALL } from "../Variables";

export function order(order, column) {
  return async function (dispatch) {
    try {
      const call = await axios.get(`${CALL.ORDER}${column}&order=${order}&limit=250`);
      const data = call.data.items ? call.data.items : call.data;
      data.forEach(function (e) { e.flag = e.flag_url || e.flag || ""; });
      dispatch({ type: ORDER, payload: data });
    } catch (e) {

    }
  };
}
