const BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";
export const CALL = {
  MAIN: BASE + "/countries",
  BY_NAME: BASE + "/countries?name=",
  BY_ID: BASE + "/countries/",
  NEW: BASE + "/activity",
  ORDER: BASE + "/countries?sort=",
  CONTINENT_FILTER: BASE + "/countries?continent="
};
export const URL_BASE = BASE;
export const COUNTRY = "/countries";
export const ACTIVITY = "/activity";
