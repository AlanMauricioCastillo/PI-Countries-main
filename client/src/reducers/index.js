import {
  WORLD,
  GET_BY_NAME,
  GET_BY_ID,
  ORDER,
  ACTIVITY_FILTER,
  CLEAR,
  PAGES,
  ADD,
} from "../actions/index";

const initialState = {
  countries: [],
  countriesDetail: {},
  countriesActivityFilter: [],
  countriesOnscreen: [],
  error: [],
};

export default function rootReducer(state = initialState, action) {
  switch (action.type) {
    case WORLD:
      return {
        ...state,
        countries: action.payload,
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
        countries: action.payload,
      };
    case ACTIVITY_FILTER:
      return {
        ...state,
        countries: action.payload,
      };
    case CLEAR:
      return {
        ...state,
        countriesDetail: action.payload,
      };
    case PAGES:
      return {
        ...state,
        countries: action.payload,
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
