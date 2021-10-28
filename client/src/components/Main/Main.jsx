import React from "react";
import { useSelector } from "react-redux";
//import { Link } from "react-router-dom";
//import { getPaged } from "../../actions/getPaged";
//import { filtrarPokemonNoPropios } from "../../actions/filtrarPokemonNoPropios";
//import { useDispatch } from "react-redux";
//import { useEffect } from "react";
//import { order } from "../../actions/order";
//import {clearDetails} from "../../actions/clearDetails"
//import { getTheWord } from "../../actions/getTheWorld";
//import details from "../Pokemon details/PokemonDetails";
import "./Main.css";

export default function Main() {
  var countriesOnscreen = useSelector((state) => state.countriesOnscreen);
console.log(countriesOnscreen)



  return (
    <div >
      MAIN
    </div>
  );
}
