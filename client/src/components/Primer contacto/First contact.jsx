import "./First contact.css";
//import { useDispatch } from "react-redux";
//import { useEffect } from "react";
//import {getThemAll} from "../../actions/getThemAll"
//import { useSelector } from "react-redux";
//import { getOwn } from "../../actions/getOwn"
//import { filterApi } from "../../actions/filterApi";
import React from "react";
import { NavLink } from "react-router-dom";

export default function FirsContact() {
  /* const dispatch = useDispatch();
  var PokemonsNoP = useSelector((state) => state.pokemonsFilter);
  var types = useSelector((state) => state.pokemonsTypes);
  useEffect(() => {
    if (!PokemonsNoP.pokemons || PokemonsNoP.pokemons.length < 1) {
      dispatch(filterApi());
    }
    if (
      PokemonsNoP.pokemons &&
      PokemonsNoP.pokemons.length > 1 &&
      types &&
      types.length > 1
    ) {
      let get = document.getElementById("get");
      get.style.display = "inline-block";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PokemonsNoP]); */

  return (
    <div className="bodys">
      <NavLink exact to="/country">
        <button 
        //id="get" className="get" 
        type="submit">
          Get them all
        </button>
      </NavLink>
    </div>
  );
}
