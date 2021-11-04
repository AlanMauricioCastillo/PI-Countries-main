import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { clearDetails } from "../../actions/clearDetails";
import { switchButton } from "../../actions/SwitchButton";
import { showHide } from "../../actions/showHide";
import Ordering from "./Ordering/Ordering";
import Filter from "./Filter/Filter";
import Finder from "./Find/Finder";
import React from "react";
import "./Buscador.css";

export default function FindAndFilt() {
  const dispatch = useDispatch();
  var switchDisplay = useSelector((state) => state.switchDisplay);
  var switchButt = useSelector((state) => state.switchButton);
  let regulateTheSize = "explorer";
  if (switchDisplay === "Home") {
    regulateTheSize = "exploring";
  } else {
    regulateTheSize = "explorer";
  }

  useEffect(() => {
    dispatch(clearDetails());
    let bar = document.getElementById("hide-me");
    if (switchDisplay === "Home") {
      bar.style.display = "";
    } else {
      dispatch(showHide("Explore"));
      if (switchDisplay === "Explore") {
      }
      bar.style.display = "none";
    }
  }, [dispatch, switchDisplay]);

  setTimeout(() => {
    if (switchButt === "begin") {
      dispatch(switchButton("begin2"));
    } else {
      dispatch(switchButton("begin"));
    }
  }, 4000);

  return (
    <div className={`${regulateTheSize}`}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a
        className={`${switchButt}`}
        id="displayNone"
        onClick={() => {
          switchDisplay === "Home"
            ? dispatch(showHide("Explore"))
            : dispatch(showHide("Home"));
        }}
      >
        {switchDisplay}
      </a>
      <div id="hide-me" className="formas">
        <h1>Explore</h1>
        <Ordering />
        <Filter />
        <Finder />
      </div>
    </div>
  );
}
