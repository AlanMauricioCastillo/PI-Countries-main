import { CONTINENT_FILTER } from "./index";
import axios from "axios";
import { CALL } from "../Variables";

export function continentFilter(continent) {
  return async function (dispatch) {
    try {
      const call = await axios.get(CALL.CONTINENT_FILTER + continent + "&limit=250");
      const data = call.data.items ? call.data.items : call.data;
      data.forEach(function (e) { e.flag = e.flag_url || e.flag || ""; });
      dispatch({ type: CONTINENT_FILTER, payload: data });
    } catch (e) {
      console.log("¡el llamado de continentFilter fallo!");
    }
  };
}
