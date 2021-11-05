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
  var switchDisplay = useSelector((state) => state.switchDisplay);
  const [switchButton, setSwitchButton] = React.useState("begin");
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
    if (switchButton === "begin") {
      setSwitchButton("begin2");
    } else {
      setSwitchButton("begin");
    }
  }, 3200);

  return (
    <div className={`${regulateTheSize}`}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a
        className={`${switchButton}`}
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
