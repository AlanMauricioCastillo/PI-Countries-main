import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect, useCallback, useRef } from "react";
import { clearDetails } from "../../../actions/clearDetails.js";
import { getFromName } from "../../../actions/getFromName.js";
import { getFromId } from "../../../actions/getFromId.js";
import React from "react";
import "../Buscador.css";
import { Link } from "react-router-dom";
import Paginado from "../../Paginado/Paginado.jsx";
import "./Finder.css"

function debounce(fn, ms) {
  let timer;
  const debounced = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}

export default function Finder() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearDetails());
  }, [dispatch]);

  const country = useSelector((state) => state.countriesDetail);
  const countries = useSelector((state) => state.reserveCountries);
  const [countryName, setCountryName] = React.useState("");
  const [countryId, setCountryId] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [countriesPerPage /* setCountriesPerPage */] = React.useState(10);
  const [loading, setLoading] = React.useState(false);
  const indexOfLastCountry = currentPage * countriesPerPage;
  const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
  const currentCountries = country.slice(
    indexOfFirstCountry,
    indexOfLastCountry
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [countries]);

  const debouncedSearch = useRef(
    debounce((name) => {
      if (name.trim() !== "") {
        dispatch(getFromName(name)).finally(() => setLoading(false));
      } else {
        dispatch(clearDetails());
        setLoading(false);
      }
    }, 300)
  ).current;

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleNameChange = useCallback((e) => {
    const value = e.target.value;
    setCountryName(value);
    if (value.trim() !== "") {
      setLoading(true);
    }
    debouncedSearch(value);
  }, [debouncedSearch]);

  const handleSearchById = () => {
    let found = countries.find(
      (country) => country.id === countryId.toUpperCase()
    );
    if (!found && countryId !== "" && countryId.length === 3) {
      alert("Inexistent ID")
      setCountryId("");
    } else if (found && countryId !== "" && countryId.length === 3) {
      dispatch(getFromId(countryId));
      setCountryId("");
    } else if (countryId !== "" && countryId.length !== 3) {
      alert("the ID must have 3 caracters");
      setCountryId("");
      setCountryName("");
    } else if (countryId === "") {
      alert("the input can't be empty");
    }
  };

  return (
    <div className="form-containerses">
      <div className="search-name-section">
        <h3>Search by Name</h3>

        <div className="search-name-wrapper">
          <input
            name="name"
            id="name"
            type="text"
            placeholder="Country Nombre..."
            value={countryName}
            onChange={handleNameChange}
          />
          {loading && <span className="search-spinner" />}
        </div>
        {!loading && countryName.trim() !== "" && country.length > 0 && (
          <span className="results-count">{country.length} result{country.length !== 1 ? "s" : ""} found</span>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          dispatch(clearDetails());
          handleSearchById();
        }}
      >
        <h3>Search by Id</h3>

        <input
          name="id"
          id="id"
          type="text"
          placeholder="Country Id..."
          value={countryId}
          onChange={(e) => setCountryId(e.target.value)}
        />
        <input type="submit" value="Search" />
      </form>
      <div className="cards">
        {currentCountries.length > 0 ? (
          currentCountries.map((e) => {
            return (
              <div key={e.id} className="card">
                <Link to={`/country/${e.id}`} className="link">
                  <div>
                    <div>
                      <img className="imagen" src={e.flag} alt="" />
                    </div>
                    <div className="textBoxFinder">
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
        countries={country.length}
        paginate={paginate}
      />
    </div>
  );
}
