import {
  WORLD,
  GET_BY_NAME,
  GET_BY_ID,
  ORDER,
  ACTIVITY_FILTER,
  CONTINENT_FILTER,
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
console.log(state.countriesDetail)
  switch (action.type) {
    case WORLD:
      return {
        ...state,
        reserveCountries: action.payload,
        countriesOnscreen: action.payload,
      };
    case GET_BY_ID:
      return {
        ...state,
        countriesDetail: action.payload,
      };
    case GET_BY_NAME:
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
      if (
        typeof state.countriesActivityFilter === "object" &&
        state.countriesActivityFilter.length > 0
      ) {
        if (!state.countriesActivityFilter.includes(action.payload.name)) {
          alert("¡Well done Activity created!");
          return {
            ...state,
            countriesActivityFilter: [
              ...state.countriesActivityFilter,
              action.payload,
            ],
          };
        } else {
          alert("the Activity was updated in some countries");
          return {
            ...state,
            countriesActivityFilter: [
              ...state.countriesActivityFilter,
              action.payload,
            ],
          };
        }
      }
      if (
        typeof state.countriesActivityFilter === "object" &&
        state.countriesActivityFilter.length < 1
      ) {
        alert("¡Well done Activity created!");
        return {
          ...state,
          countriesActivityFilter: [
            ...state.countriesActivityFilter,
            action.payload,
          ],
        };
      }
      break;
    default:
      return state;
  }
}
