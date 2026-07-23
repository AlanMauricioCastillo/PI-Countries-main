import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./animations.css";
import App from "./App";
import axios from 'axios';
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./store/index.js";
import reportWebVitals from "./reportWebVitals";
import "./responsive.css";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
axios.defaults.baseURL = API_URL;

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('auth_token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
