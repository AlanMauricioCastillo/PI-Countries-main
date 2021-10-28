import "./First contact.css";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import {getTheWorld} from "../../actions/getTheWorld.js"
import { useSelector } from "react-redux";
import React from "react";
import { NavLink } from "react-router-dom";

export default function FirsContact() {
  const dispatch = useDispatch();
  var countries = useSelector((state) => state.countries);
  useEffect(() => {
    if (!countries || countries.length < 1) {
      dispatch(getTheWorld());
    }
    if (
      countries &&
      countries.length > 1 
    ) {
      let get = document.getElementById("get");
      get.style.display = "inline-block";
    }
  }, [countries, dispatch]);

  return (
    <div className="bodys">
      <NavLink exact to="/country">
        <button 
        id="get" className="get" 
        type="submit">
          World Wide
        </button>
      </NavLink>
    </div>
  );
}
