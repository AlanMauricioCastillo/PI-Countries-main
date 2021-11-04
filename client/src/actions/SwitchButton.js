import { SWITCH_BUTTON } from "./index";

export function switchButton(prosses) {
  return {
    type: SWITCH_BUTTON,
    payload: prosses,
  }
}