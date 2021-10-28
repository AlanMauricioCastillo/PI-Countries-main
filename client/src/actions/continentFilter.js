import { CONTINENT_FILTER } from "./index";
import axios from "axios";
import { CALL } from "../Variables";

export function continentFilter(continent) {
  return async function (dispatch) {
    try {
      const call = await axios.get(CALL.CONTINENT_FILTER + continent);
      console.log(call.data)
      dispatch({ type: CONTINENT_FILTER, payload: call.data });
    } catch (e) {
      console.log("¡el llamado de continentFilter fallo!");
    }
  };
}