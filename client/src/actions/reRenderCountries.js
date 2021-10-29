import { RE_RENDER_COUNTRIES } from "./index";

export function reRenderCountries() {
  return {
    type: RE_RENDER_COUNTRIES,
    payload: null,
  };
}