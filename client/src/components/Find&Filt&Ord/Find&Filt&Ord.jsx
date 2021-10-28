import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { clearDetails } from "../../actions/clearDetails";
import { showHide } from "../../actions/showHide";
import Ordering from "./Ordering/Ordering";
import Filter from "./Filter/Filter";
import Finder from "./Find/Finder";
import React from "react";
import "./Buscador.css";

export default function FindAndFilt() {
  const dispatch = useDispatch();
  var swithDisplay = useSelector((state) => state.swithDisplay);

  useEffect(() => {
    dispatch(clearDetails());
    let bar = document.getElementById("hide-me");
    //let pagination = document.getElementById("pagination");
    if (swithDisplay === "Home") {
      bar.style.display = "inline-block";
      //pagination.style.display = "none";
    } else {
      dispatch(showHide("Explorar"));
      if (swithDisplay === "Explorar") {
      }
      bar.style.display = "none";
      //pagination.style.display = "inline-block";
    }
  }, [dispatch, swithDisplay]);

  return (
    <div className="big">
      <button
        className="begin"
        id="displayNone"
        onClick={() => {
          swithDisplay === "Home"
            ? dispatch(showHide("Explorar"))
            : dispatch(showHide("Home"));
        }}
      >
        {swithDisplay}
      </button>
      <div id="hide-me" className="formas">
        <ul>
          <div>
            <Ordering />
            <Filter />
            <Finder />
          </div>
        </ul>
      </div>
    </div>
  );
}
