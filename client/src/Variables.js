//http://localhost:3001/Pokemons
const BASE = "";
export const CALL = {
  MAIN: BASE + "/Country",
  BY_NAME: BASE + "/Country?name=", // + nombre
  BY_ID: BASE + "/Country/", // + id
  //ACTIVITIES: BASE + "/Activity",
  NEW: BASE + "/Activity", // va esto mas una coma mas el estado ej: axios(new, estate)
  ORDER: BASE + "/Country/order/", // + order + "/" + column
  CONTINENT_FILTER: BASE + "/Country/continentFilter/" // + continent
};
