import { PAGES } from "./index";
import axios from "axios";
import { CALL } from "../Variables";

export function getPaged(page) {
  return async function (dispatch) {
    try {
      const call = await axios.get(CALL.PAGES + page);
      dispatch({ type: PAGES, payload: call.data });
    } catch (e) {
      console.log("¡el llamado de getPaged fallo!");
    }
  };
}
