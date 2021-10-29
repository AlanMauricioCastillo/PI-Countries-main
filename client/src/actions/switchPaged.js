import { SWITCH_PAGED } from "./index";

export function switchPaged(prosses) {
  console.log(prosses)
  return {
    type: SWITCH_PAGED,
    payload: prosses,
  }
}