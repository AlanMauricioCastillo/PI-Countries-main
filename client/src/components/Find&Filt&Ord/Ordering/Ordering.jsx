import { useDispatch } from "react-redux";
import { order } from "../../../actions/order";
import { reRenderCountries } from "../../../actions/reRenderCountries";
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
    } else {
      dispatch(reRenderCountries());
    }
  }

  return (
    <div>
      <div>
        <p>
          <label>Orden Alfabetico</label>
          <select name="name" onChange={(e) => handleOrder(e)}>
            <option value="refresh">All Mix</option>
            <option value="ASC">A-Z</option>
            <option value="DESC">Z-A</option>
          </select>

          <label>Orden por Poblacion</label>
          <select name="population" onChange={(e) => handleOrder(e)}>
            <option value="refresh">All Mix</option>
            <option value="DESC">Mayor a Menor</option>
            <option value="ASC">Menor a Mayor</option>
          </select>
        </p>
      </div>
    </div>
  );
}
