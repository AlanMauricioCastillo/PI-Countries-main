import { CLEAR } from "./index";

export function clearDetails() {
  return {
    type: CLEAR,
    payload: {},
  };
}
