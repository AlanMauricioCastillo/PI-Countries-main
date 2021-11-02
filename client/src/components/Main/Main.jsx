import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Paginado from "../Paginado/Paginado.jsx";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getTheWorld } from "../../actions/getTheWorld.js";
import "./Main.css";

export default function Main() {
  const dispatch = useDispatch();
  var base = useSelector((state) => state.reserveCountries);
  useEffect(() => {
    if(base.length===0){
    dispatch(getTheWorld());
    }
  }, [base.length, dispatch]);

  var switchPaged = useSelector((state) => state.switchPaged);
  var countries = useSelector((state) => state.countriesOnscreen);
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
    <div className="bodies">
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
