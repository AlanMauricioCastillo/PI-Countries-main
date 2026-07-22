import { CLEAR_WORLD } from "./index";

export function clearTheWorld() {

  return {
    type: CLEAR_WORLD,
    payload: [],
  };
}
