import { ADD } from "./index";
import axios from "axios";
import { CALL } from "../Variables";

export function newActivity(payload) {
  return async function (dispatch) {
    try {
      const body = {
        name: payload.name,
        difficulty: parseInt(payload.difficulty, 10),
        duration: parseInt(payload.duration, 10),
        season: payload.season,
        risk_level: parseInt(payload.risk_level || 1, 10),
        about: payload.about || null,
        country_ids: payload.countryId || payload.country_ids || [],
      };
      const call = await axios.post(CALL.NEW, body);
      dispatch({ type: ADD, payload: call.data });
    } catch (e) {
      const msg = e.response?.data?.detail || "Activity creation failed, retry";
      alert(msg);
    }
  };
}
