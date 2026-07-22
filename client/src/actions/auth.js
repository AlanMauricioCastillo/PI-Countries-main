import { LOGIN, REGISTER, LOGOUT, AUTH_ME } from "./index";
import axios from "axios";
import { CALL } from "../Variables";

export function loginUser(credentials) {
  return async function (dispatch) {
    try {
      const call = await axios.post(CALL.AUTH_LOGIN, {
        identifier: credentials.username,
        password: credentials.password,
      });
      const data = call.data;
      localStorage.setItem("auth_token", data.access_token);
      dispatch({
        type: LOGIN,
        payload: {
          token: data.access_token,
          tokenType: data.token_type,
          expiresIn: data.expires_in,
        },
      });
      return data;
    } catch (e) {
      const msg = e.response?.data?.detail || "Login failed";
      throw new Error(typeof msg === "string" ? msg : "Login failed");
    }
  };
}

export function registerUser(userData) {
  return async function (dispatch) {
    try {
      const call = await axios.post(CALL.AUTH_REGISTER, {
        email: userData.email,
        username: userData.username,
        password: userData.password,
      });
      dispatch({ type: REGISTER, payload: call.data });
      return call.data;
    } catch (e) {
      const msg = e.response?.data?.detail || "Registration failed";
      throw new Error(typeof msg === "string" ? msg : "Registration failed");
    }
  };
}

export function fetchAuthMe() {
  return async function (dispatch) {
    try {
      const call = await axios.get(CALL.AUTH_ME);
      dispatch({ type: AUTH_ME, payload: call.data });
      return call.data;
    } catch (e) {
      console.log("auth/me failed");
    }
  };
}

export function logoutUser() {
  localStorage.removeItem("auth_token");
  return {
    type: LOGOUT,
    payload: null,
  };
}
