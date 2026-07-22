import { GET_FAVORITES, ADD_FAVORITE, REMOVE_FAVORITE } from "./index";
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

export function getFavorites() {
  return async function (dispatch) {
    try {
      const call = await axios.get(CALL.FAVORITES);
      const items = Array.isArray(call.data) ? call.data : [];
      dispatch({ type: GET_FAVORITES, payload: items.map(normalizeCountry) });
    } catch (e) {
      console.log("getFavorites failed!");
    }
  };
}

export function addFavorite(countryId) {
  return async function (dispatch) {
    try {
      const call = await axios.post(CALL.FAVORITES + "/" + countryId);
      dispatch({ type: ADD_FAVORITE, payload: call.data });
      return call.data;
    } catch (e) {
      const msg = e.response?.data?.detail || "Failed to add favorite";
      throw new Error(typeof msg === "string" ? msg : "Failed to add favorite");
    }
  };
}

export function removeFavorite(countryId) {
  return async function (dispatch) {
    try {
      await axios.delete(CALL.FAVORITES + "/" + countryId);
      dispatch({ type: REMOVE_FAVORITE, payload: countryId });
    } catch (e) {
      const msg = e.response?.data?.detail || "Failed to remove favorite";
      throw new Error(typeof msg === "string" ? msg : "Failed to remove favorite");
    }
  };
}
