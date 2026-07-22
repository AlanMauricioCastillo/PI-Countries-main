import { WORLD } from "./index";
import axios from "axios";
import { CALL } from "../Variables";

function normalizeCountry(c) {
  return {
    ...c,
    flag: c.flag_url || c.flag,
    map: c.map_url || c.map,
    Activities: c.activities || c.Activities || [],
  };
}

export function getTheWorld() {
  return async function (dispatch) {
    try {
      const call = await axios.get(CALL.MAIN + "?limit=100");
      const items = call.data.items || call.data;
      const payload = Array.isArray(items) ? items.map(normalizeCountry) : [];
      dispatch({ type: WORLD, payload });
    } catch (e) {
      console.log("getTheWorld failed!");
    }
  };
}
