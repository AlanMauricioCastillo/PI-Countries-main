import { SWITCH_PAGED } from "./index";

export function switchPaged(prosses) {
  return {
    type: SWITCH_PAGED,
    payload: prosses,
  };
}
