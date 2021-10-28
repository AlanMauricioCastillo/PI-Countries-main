import { useDispatch } from "react-redux";
import { continentFilter } from "../../../actions/continentFilter";
/*import { useSelector } from "react-redux";
import { useEffect } from "react";
import { clearDetails } from "../../actions/clearDetails";
import { getFromName } from "../../actions/getFromName";
import { getFromId } from "../../actions/getFromId";
import { showHide } from "../../actions/showHide"; */
import React from "react";
import "../Buscador.css";
//import { Link } from "react-router-dom";

export default function Filter() {
  const dispatch = useDispatch();

  const handleContinentFilt = (e) => {
    let comand = e.target.value;
    if (comand !== "refresh") {
      dispatch(continentFilter(comand));
    }
  };

  return (
    <div>
      <h1 className="titleBuscador">Filtrar</h1>
      <label>Actividad</label>
      <p>
        <label>Dificultad</label>
        <select>
          <option value="refresh">All</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>

        <label>Duracion</label>
        <select>
          <option value="refresh">All</option>
          <option value="1">1 Mes</option>
          <option value="2">2 Meses</option>
          <option value="3">3 Meses</option>
          <option value="4">4 Meses</option>
          <option value="5">5 Meses</option>
          <option value="6">6 Meses</option>
          <option value="7">7 Meses</option>
          <option value="8">8 Meses</option>
          <option value="9">9 Meses</option>
          <option value="10">10 Meses</option>
          <option value="11">11 Meses</option>
          <option value="12">12 Meses</option>
        </select>

        <label>Temporada</label>
        <select>
          <option value="refresh">All</option>
          <option value="spring">Primavera</option>
          <option value="summer">Verano</option>
          <option value="fall">Otoño</option>
          <option value="winter">Invierno</option>
        </select>
      </p>

      <label>Continente</label>
      <p>
        <label>Continente</label>
        <select onChange={(e) => handleContinentFilt(e)}>
          <option value="refresh">All</option>
          <option value="south america">South america</option>
          <option value="europe">Europe</option>
          <option value="antarctica">Antarctica</option>
          <option value="asia">Asia</option>
          <option value="africa">Africa</option>
          <option value="north america">North america</option>
          <option value="oceania">Oceania</option>
        </select>
      </p>
    </div>
  );
}
