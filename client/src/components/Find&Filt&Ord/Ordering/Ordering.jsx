import { useDispatch } from "react-redux";
import { order } from "../../../actions/order";
/*import { useSelector } from "react-redux"; */
import React from "react";
import "../Buscador.css";
//import { Link } from "react-router-dom";

export default function Ordering() {
  const dispatch = useDispatch();

  function handleOrder(e) {
    if (e.target.value !== "refresh") {
    dispatch(order(e.target.value, e.target.name));
    /* setCurrentPage(1); */
    }
  }

  return (
    <div>
      <h1 className="titleBuscador">Ordenar</h1>
      <div>
        <p>
          <label>Orden Alfabetico</label>
          <select name="name" onChange={(e) => handleOrder(e)}>
            <option value="refresh"></option>
            <option value="ASC">A-Z</option>
            <option value="DESC">Z-A</option>
          </select>

          <label>Orden por Poblacion</label>
          <select name="population" onChange={(e) => handleOrder(e)}>
            <option value="refresh"></option>
            <option value="DESC">Mayor a Menor</option>
            <option value="ASC">Menor a Mayor</option>
          </select>
        </p>
      </div>
    </div>
  );
}
