import { CLEAR_WORLD } from "./index";

export function clearTheWorld() {
  console.log('entre al cleare world')
  return {
    type: CLEAR_WORLD,
    payload: [],
  };
}
