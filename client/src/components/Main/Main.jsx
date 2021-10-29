import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
//import { getFromId } from "../../actions/getFromId.js";
import Paginado from "../Paginado/Paginado.jsx";
//import { getPaged } from "../../actions/getPaged";
//import { filtrarPokemonNoPropios } from "../../actions/filtrarPokemonNoPropios";
//import { useDispatch } from "react-redux";
import { useEffect } from "react";
//import { order } from "../../actions/order";
//import {clearDetails} from "../../actions/clearDetails"
//import { getTheWord } from "../../actions/getTheWorld";
//import details from "../Pokemon details/PokemonDetails";
import "./Main.css";

export default function Main() {
  //const dispatch = useDispatch();
  var countries = useSelector((state) => state.countriesOnscreen);
  var switchPaged = useSelector((state) => state.switchPaged);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [countriesPerPage /* setCountriesPerPage */] = React.useState(10);
  const indexOfLastCountry = currentPage * countriesPerPage;
  const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
  const currentCountries = countries.slice(
    indexOfFirstCountry,
    indexOfLastCountry
  );

  if (switchPaged === "notFiltering") {
    if (currentPage === 1) {
      currentCountries.pop();
    }
  }

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [countries]);

  let set = new Set(currentCountries.map(JSON.stringify));
  let arrSinDuplicaciones = Array.from(set).map(JSON.parse);
  return (
    <div>
      <div id="main" className="cards">
        {arrSinDuplicaciones.length ? (
          arrSinDuplicaciones.map((e) => {
            return (
              <div key={e.id} className="card">
                <Link to={`/country/${e.id}`} className="link">
                  <div value={e.id} id={e.id}>
                    <div>
                      <img className="imagen" src={e.flag} alt="" />
                    </div>
                    <div className="textBox">
                      <h3>{e.name}</h3>
                      <h5>{e.continent}</h5>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        ) : (
          <span></span>
        )}
      </div>
      <Paginado
        countriesPerPage={countriesPerPage}
        countries={countries.length}
        paginate={paginate}
      />
    </div>
  );
}
