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
  GET_ACTIVITIES,
  LOGIN,
  REGISTER,
  LOGOUT,
  AUTH_ME,
  GET_FAVORITES,
  ADD_FAVORITE,
  REMOVE_FAVORITE,
} from "../actions/index";

const initialState = {
  reserveCountries: [],
  countriesDetail: [],
  countriesActivityFilter: [],
  countriesOnscreen: [],
  switchDisplay: "Explore",
  switchPaged: "notFiltering",
  error: [],
  auth: {
    token: localStorage.getItem("auth_token") || null,
    tokenType: null,
    expiresIn: null,
    user: null,
  },
  favorites: [],
  activities: [],
};

export default function rootReducer(state = initialState, action) {
  switch (action.type) {
    case WORLD:
      if (action.payload[0] && action.payload[0].Activities !== undefined) {
        action.payload.forEach((e) => {
          if (e.Activities && e.Activities.length) {
            e.Activities.sort((a, b) => {
              return (b.CountryActivity?.ActivityId || 0) - (a.CountryActivity?.ActivityId || 0);
            });
          }
        });
        action.payload.forEach((e) => {
          if (e.Activities && e.Activities.length) {
            const setObj = new Set();
            const unicos = e.Activities.reduce((acc, activity) => {
              if (!setObj.has(activity.name)) {
                setObj.add(activity.name);
                acc.push(activity);
              }
              return acc;
            }, []);
            e.Activities = unicos;
          }
        });
        let arr = action.payload.filter((e) => {
          return e.Activities && e.Activities.length > 0;
        });
        let arrFiltered = arr.map((e) => {
          return { id: e.id, Activities: e.Activities };
        });
        return {
          ...state,
          reserveCountries: action.payload,
          countriesOnscreen: action.payload,
          countriesActivityFilter: [arrFiltered, ...state.countriesActivityFilter],
        };
      } else {
        return {
          ...state,
          reserveCountries: action.payload,
          countriesOnscreen: action.payload,
        };
      }
    case GET_BY_ID:
      action.payload.forEach((e) => {
        if (e.Activities && e.Activities.length) {
          e.Activities.sort((a, b) => {
            return (b.CountryActivity?.ActivityId || 0) - (a.CountryActivity?.ActivityId || 0);
          });
        }
      });
      action.payload.forEach((e) => {
        if (e.Activities && e.Activities.length) {
          const setObj = new Set();
          const unicos = e.Activities.reduce((acc, activity) => {
            if (!setObj.has(activity.name)) {
              setObj.add(activity.name);
              acc.push(activity);
            }
            return acc;
          }, []);
          e.Activities = unicos;
        }
      });
      return { ...state, countriesDetail: action.payload };
    case GET_BY_NAME:
      action.payload.forEach((e) => {
        if (e.Activities && e.Activities.length) {
          e.Activities.sort((a, b) => {
            return (b.CountryActivity?.ActivityId || 0) - (a.CountryActivity?.ActivityId || 0);
          });
        }
      });
      action.payload.forEach((e) => {
        if (e.Activities && e.Activities.length) {
          const setObj = new Set();
          const unicos = e.Activities.reduce((acc, activity) => {
            if (!setObj.has(activity.name)) {
              setObj.add(activity.name);
              acc.push(activity);
            }
            return acc;
          }, []);
          e.Activities = unicos;
        }
      });
      return { ...state, countriesDetail: action.payload };
    case ORDER:
      return { ...state, countriesOnscreen: action.payload };
    case ACTIVITY_FILTER:
      return { ...state, countriesOnscreen: action.payload };
    case CONTINENT_FILTER:
      return { ...state, countriesOnscreen: action.payload };
    case CLEAR:
      return { ...state, countriesDetail: action.payload };
    case CLEAR_WORLD:
      return { ...state, reserveCountries: action.payload, countriesActivityFilter: action.payload };
    case SHOW_HIDE:
      return { ...state, switchDisplay: action.payload };
    case SWITCH_PAGED:
      return { ...state, switchPaged: action.payload };
    case RE_RENDER_COUNTRIES:
      return { ...state, countriesOnscreen: [...state.reserveCountries] };
    case ADD:
      if (state.countriesActivityFilter[0] && state.countriesActivityFilter[0].length > 0) {
        let existent = [];
        state.countriesActivityFilter[0].forEach((e) => {
          existent.push({
            id: (action.payload.country_ids || []).map((element) => element === e.id),
            name: (e.Activities || []).map((name) => name.name === action.payload.name),
          });
        });
        let found = existent.find((e) => {
          return e.id.includes(true) && e.name.includes(true);
        });
        if (found) {
          alert("the Activity was updated in some countries");
        } else {
          alert("Well done Activity created!");
        }
      }
      if (!state.countriesActivityFilter[0] || state.countriesActivityFilter[0].length < 1) {
        alert("Well done Activity created!");
      }
      return state;
    case GET_ACTIVITIES:
      return { ...state, activities: action.payload };
    case LOGIN:
      return { ...state, auth: { ...state.auth, token: action.payload.token, tokenType: action.payload.tokenType, expiresIn: action.payload.expiresIn } };
    case REGISTER:
      return { ...state, auth: { ...state.auth, user: action.payload } };
    case LOGOUT:
      return { ...state, auth: { token: null, tokenType: null, expiresIn: null, user: null }, favorites: [] };
    case AUTH_ME:
      return { ...state, auth: { ...state.auth, user: action.payload } };
    case GET_FAVORITES:
      return { ...state, favorites: action.payload };
    case ADD_FAVORITE:
      return state;
    case REMOVE_FAVORITE:
      return { ...state, favorites: state.favorites.filter((c) => c.id !== action.payload) };
    default:
      return state;
  }
}
