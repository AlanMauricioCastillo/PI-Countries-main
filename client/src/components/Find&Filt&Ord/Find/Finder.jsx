import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { clearDetails } from "../../../actions/clearDetails.js";
import { getFromName } from "../../../actions/getFromName.js";
import { getFromId } from "../../../actions/getFromId.js";
import React from "react";
import "../Buscador.css";
import { Link } from "react-router-dom";

export default function Finder() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearDetails());
  }, [dispatch]);

  const [countryName, setCountryName] = React.useState("");
  const [countryId, setCountryId] = React.useState("");
  var country = useSelector((state) => state.countriesDetail);
  var countries = useSelector((state) => state.reserveCountries);

  const handleSerch = () => {
    let found = countries.find(
      (country) => country.id === countryId.toUpperCase()
    );
    if (found && countryId !== "" && countryId.length === 3) {
      dispatch(getFromId(countryId));
      setCountryId("");
    } else if (countryName !== "") {
      dispatch(getFromName(countryName));
      setCountryName("");
    } else {
      alert(
        "el campo no puede estar vacio y el id debe ser de tres letras maximo"
      );
      setCountryId("");
      setCountryName("");
    }
  };
  console.log(country);
  return (
    <div className="form-containerses">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          clearDetails();
          handleSerch();
        }}
      >
        
          <h3>Busqueda por Nombre</h3>
        
        <input
          name="name"
          id="name"
          type="text"
          placeholder="Country Nombre..."
          value={countryName}
          onChange={(e) => setCountryName(e.target.value)}
        />
        <input type="submit" value="Buscar" />

        
          <h3>Busqueda por Id</h3>
        
        <input
          name="id"
          id="id"
          type="text"
          placeholder="Country Id..."
          value={countryId}
          onChange={(e) => setCountryId(e.target.value)}
        />
        <input type="submit" value="Buscar" />
      </form>
      <div className="cards">
        {country.length > 0 ? (
          country.map((e) => {
            return (
              <div key={e.id} className="card">
                <Link to={`/country/${e.id}`} className="link">
                  <div>
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
    </div>
  );
}
