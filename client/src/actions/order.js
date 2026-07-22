import { ORDER } from "./index";
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

export function order(order, column) {
  return async function (dispatch) {
    try {
      const sortCol = column || "name";
      const sortOrder = (order || "asc").toLowerCase();
      const call = await axios.get(`${CALL.MAIN}?sort=${sortCol}&order=${sortOrder}&limit=100`);
      const items = call.data.items || call.data;
      const payload = Array.isArray(items) ? items.map(normalizeCountry) : [];
      dispatch({ type: ORDER, payload });
    } catch (e) {
      console.log(e);
    }
  };
}
