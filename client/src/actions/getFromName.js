import { GET_BY_NAME } from "./index";
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

export function getFromName(name) {
  return async function (dispatch) {
    try {
      const call = await axios.get(CALL.BY_NAME + encodeURIComponent(name));
      const items = call.data.items || call.data;
      const payload = Array.isArray(items) ? items.map(normalizeCountry) : [];
      dispatch({ type: GET_BY_NAME, payload });
    } catch (e) {
      alert("non-existent country!");
    }
  };
}
