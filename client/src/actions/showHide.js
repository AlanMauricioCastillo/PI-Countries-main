import { SHOW_HIDE } from "./index";

export function showHide(comand) {
  return {
    type: SHOW_HIDE,
    payload: comand,
  };
}
