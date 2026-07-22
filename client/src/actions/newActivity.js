import { ADD } from "./index";
import axios from "axios";
import { CALL } from "../Variables";

export function newActivity(payload) {
  return async function (dispatch) {
    try {
      const body = {
        name: payload.name,
        difficulty: parseInt(payload.difficulty),
        duration: parseInt(payload.duration),
        season: payload.season.length > 0 ? payload.season[0] : "summer",
        risk_level: parseInt(payload.difficulty),
        country_ids: payload.countryId,
      };
      const call = await axios.post(CALL.NEW, body);
      dispatch({ type: ADD, payload: call.data });
    } catch (e) {
      alert("El llamado de newActivity fallo, reacer formulario");
    }
  };
}
