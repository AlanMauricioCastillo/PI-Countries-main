import {
  WORLD,
  GET_BY_NAME,
  GET_BY_ID,
  ORDER,
  ACTIVITY_FILTER,
  CONTINENT_FILTER,
  CLEAR_WORLD,
  SWITCH_PAGED,
  CLEAR,
  RE_RENDER_COUNTRIES,
  SHOW_HIDE,
  ADD,
} from "../actions/index";

const initialState = {
  reserveCountries: [],
  countriesDetail: [],
  countriesActivityFilter: [],
  countriesOnscreen: [],
  switchDisplay: "Explore",
  switchPaged: "notFiltering",
  error: [],
};

export default function rootReducer(state = initialState, action) {
  const payload = action.payload && action.payload.items ? action.payload.items : action.payload;
  switch (action.type) {
    case WORLD:
      if (!payload || payload.length === 0) {
        return { ...state, reserveCountries: [], countriesOnscreen: [] };
      }
      payload.forEach(function (e) {
        e.flag = e.flag_url || e.flag || "";
        e.Activities = e.activities || e.Activities || [];
      });
      if (payload[0].Activities !== undefined) {
        payload.forEach((e) => {
          e.Activities.sort((a, b) => {
            return b.CountryActivity.ActivityId - a.CountryActivity.ActivityId;
          });
        });

        payload.forEach((e) => {
          const setObj = new Set();
          const unicos = e.Activities.reduce((acc, activity) => {
            if (!setObj.has(activity.name)) {
              setObj.add(activity.name, activity);
              acc.push(activity);
            }
            return acc;
          }, []);
          e.Activities = unicos;
        });
        let arr = [];
        state.countriesActivityFilter = [];
        arr = payload.filter((e) => {
          return e.Activities.length > 0 && e.Activities;
        });
        let arrFiltered = arr.map((e) => {
          return {
            id: e.id,
            Activities: e.Activities,
          };
        });

        arr = [...arrFiltered, state.countriesActivityFilter];
        return {
          ...state,
          reserveCountries: payload,
          countriesOnscreen: payload,
          countriesActivityFilter: [
            ...state.countriesActivityFilter,
            arr.flat(),
          ],
        };
      } else {
        let arr = [];
        arr = [...arr, state.countriesActivityFilter];
        return {
          ...state,
          reserveCountries: payload,
          countriesOnscreen: payload,
          countriesActivityFilter: [
            ...state.countriesActivityFilter,
            arr.flat(),
          ],
        };
      }
    case GET_BY_ID:
      const p = Array.isArray(payload) ? payload : [payload];
      p.forEach((e) => {
        e.flag = e.flag_url || e.flag || "";
        e.Activities = e.activities || e.Activities || [];
        e.map = e.map_url || e.links?.google_maps || "";
        const acts = e.Activities;
        if (acts.length > 0) {
          acts.sort((a, b) => {
            return (b.CountryActivity?.ActivityId || b.id || 0) - (a.CountryActivity?.ActivityId || a.id || 0);
          });
          const setObj = new Set();
          e.Activities = acts.reduce((acc, activity) => {
            if (!setObj.has(activity.name)) {
              setObj.add(activity.name, activity);
              acc.push(activity);
            }
            return acc;
          }, []);
        }
      });
      return {
        ...state,
        countriesDetail: p,
      };
    case GET_BY_NAME:
      payload.forEach((e) => {
        e.Activities.sort((a, b) => {
          return b.CountryActivity.ActivityId - a.CountryActivity.ActivityId;
        });
      });

      payload.forEach((e) => {
        const setObj = new Set();
        const unicos = e.Activities.reduce((acc, activity) => {
          if (!setObj.has(activity.name)) {
            setObj.add(activity.name, activity);
            acc.push(activity);
          }
          return acc;
        }, []);
        e.Activities = unicos;
      });
      return {
        ...state,
        countriesDetail: payload,
      };
    case ORDER:
      return {
        ...state,
        countriesOnscreen: payload,
      };
    case ACTIVITY_FILTER:
      return {
        ...state,
        countriesOnscreen: payload,
      };
    case CONTINENT_FILTER:
      return {
        ...state,
        countriesOnscreen: payload,
      };
    case CLEAR:
      return {
        ...state,
        countriesDetail: payload,
      };
    case CLEAR_WORLD:
      return {
        ...state,
        reserveCountries: payload,
        countriesActivityFilter: payload,
      };
    case SHOW_HIDE:
      return {
        ...state,
        switchDisplay: payload,
      };
    case SWITCH_PAGED:
      return {
        ...state,
        switchPaged: payload,
      };
    case RE_RENDER_COUNTRIES:
      const mountAgain = [...state.reserveCountries];
      return {
        ...state,
        countriesOnscreen: mountAgain,
      };
    case ADD:
      if (state.countriesActivityFilter[0].length > 0) {
        let existent = [];
        // eslint-disable-next-line no-unused-vars
        let a = [];
        state.countriesActivityFilter[0].forEach((e) => {
          existent.push({
            id: (a = payload.countryId.map((element) => {
              return element === e.id ? true : false;
            })),
            name: e.Activities.map((name) => {
              return name.name === payload.name;
            }),
          });
        });
        let found = existent.find((e) => {
          return e.id.includes(true) && e.name.includes(true);
        });

        if (found) {
          alert("the Activity was updated in some countries");
          let arr = [];
          payload.countryId.forEach((e) => {
            return arr.push({
              id: e,
              Activities: [
                {
                  name: payload.name,
                },
              ],
            });
          });
          return {
            ...state,
            countriesActivityFilter: [
              ...state.countriesActivityFilter,
              arr,
            ].flat(),
          };
        } else {
          alert("¡Well done Activity created!");
          let arr = [];
          payload.countryId.forEach((e) => {
            return arr.push({
              id: e,
              Activities: [
                {
                  name: payload.name,
                },
              ],
            });
          });
        }
      }
      if (state.countriesActivityFilter[0].length < 1) {
        alert("¡Well done Activity created!");
        let arr = [];
        payload.countryId.forEach((e) => {
          return arr.push({
            id: e,
            Activities: [
              {
                name: payload.name,
              },
            ],
          });
        });
        return {
          ...state,
          countriesActivityFilter: [
            ...state.countriesActivityFilter,
            arr,
          ].flat(),
        };
      }
      break;
    default:
      return state;
  }
}
