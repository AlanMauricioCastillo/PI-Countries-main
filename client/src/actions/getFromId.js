import { GET_BY_ID } from "./index";
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

export function getFromId(id) {
  return async function (dispatch) {
    try {
      const call = await axios.get(CALL.BY_ID + id);
      const data = call.data;
      const payload = Array.isArray(data) ? data.map(normalizeCountry) : [normalizeCountry(data)];
      dispatch({ type: GET_BY_ID, payload });
    } catch (e) {
      alert("non-existent country!");
    }
  };
}
