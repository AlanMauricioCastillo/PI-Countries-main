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
  switchDisplay: "Explorar",
  switchPaged: "notFiltering",
  error: [],
};

export default function rootReducer(state = initialState, action) {
  switch (action.type) {
    case WORLD:
      action.payload.forEach((e) => {
        e.Activities.sort((a, b) => {
          return b.CountryActivity.ActivityId - a.CountryActivity.ActivityId;
        });
      });

      action.payload.forEach((e) => {
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

      if (action.payload[0].Activities !== undefined) {
        let arr = [];
        state.countriesActivityFilter = [];
        arr = action.payload.filter((e) => {
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
          reserveCountries: action.payload,
          countriesOnscreen: action.payload,
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
          reserveCountries: action.payload,
          countriesOnscreen: action.payload,
          countriesActivityFilter: [
            ...state.countriesActivityFilter,
            arr.flat(),
          ],
        };
      }
    case GET_BY_ID:
      action.payload.forEach((e) => {
        e.Activities.sort((a, b) => {
          return b.CountryActivity.ActivityId - a.CountryActivity.ActivityId;
        });
      });

      action.payload.forEach((e) => {
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
        countriesDetail: action.payload,
      };
    case GET_BY_NAME:
      action.payload.forEach((e) => {
        e.Activities.sort((a, b) => {
          return b.CountryActivity.ActivityId - a.CountryActivity.ActivityId;
        });
      });

      action.payload.forEach((e) => {
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
        countriesDetail: action.payload,
      };
    case ORDER:
      return {
        ...state,
        countriesOnscreen: action.payload,
      };
    case ACTIVITY_FILTER:
      return {
        ...state,
        countriesOnscreen: action.payload,
      };
    case CONTINENT_FILTER:
      return {
        ...state,
        countriesOnscreen: action.payload,
      };
    case CLEAR:
      return {
        ...state,
        countriesDetail: action.payload,
      };
    case CLEAR_WORLD:
      return {
        ...state,
        reserveCountries: action.payload,
        countriesActivityFilter: action.payload,
      };
    case SHOW_HIDE:
      return {
        ...state,
        switchDisplay: action.payload,
      };
    case SWITCH_PAGED:
      return {
        ...state,
        switchPaged: action.payload,
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
            id: (a = action.payload.countryId.map((element) => {
              return element === e.id ? true : false;
            })),
            name: e.Activities.map((name) => {
              return name.name === action.payload.name;
            }),
          });
        });
        let found = existent.find((e) => {
          return e.id.includes(true) && e.name.includes(true);
        });

        if (found) {
          alert("the Activity was updated in some countries");
          let arr = [];
          action.payload.countryId.forEach((e) => {
            return arr.push({
              id: e,
              Activities: [
                {
                  name: action.payload.name,
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
          action.payload.countryId.forEach((e) => {
            return arr.push({
              id: e,
              Activities: [
                {
                  name: action.payload.name,
                },
              ],
            });
          });
        }
      }
      if (state.countriesActivityFilter[0].length < 1) {
        alert("¡Well done Activity created!");
        let arr = [];
        action.payload.countryId.forEach((e) => {
          return arr.push({
            id: e,
            Activities: [
              {
                name: action.payload.name,
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
