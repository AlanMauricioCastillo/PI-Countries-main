import { ORDER } from "./index";
import axios from "axios";
import { CALL } from "../Variables";

export function order(order, column) {
  return function (dispatch) {
    try {
    const call = await axios.get(`${CALL.ORDER}${order}/${column}`);
    if (call) {
      dispatch({ type: ORDER, payload: call.data });
    }
  } catch (e) {
    console.log(e)
  }
  };
}
