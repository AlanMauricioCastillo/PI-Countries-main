import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { clearDetails } from "../../actions/clearDetails";
import { getFromName } from "../../actions/getFromName";
import { getFromId } from "../../actions/getFromId";
import React from "react";
import "./Buscador.css";
import { Link } from "react-router-dom";

export default function Buscador() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearDetails());
  }, [dispatch]);
  const [countryName, setCountryName] = React.useState("");
  const [countryId, setCountryId] = React.useState("");
  var details = useSelector((state) => state.countriesDetail);
  console.log(countryName);
  console.log(countryId);
  const chose = () => {
    if (countryId !== "") {
      dispatch(getFromId(countryId));
      setCountryId("");
    }
    if (countryName !== "") {
      dispatch(getFromName(countryName));
      setCountryName("");
    }
  };
  console.log(details);
  return (
    <div className="big">
      <div className="form-containerses">
        <h1 className="titleBuscador">Buscar</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            clearDetails();
            chose();
          }}
        >
          <input
            name="name"
            type="text"
            placeholder="Country Name..."
            value={countryName}
            onChange={(e) => setCountryName(e.target.value)}
          />
          <input type="submit" value="Buscar" />

          <input
            name="id"
            type="text"
            placeholder="Country Id..."
            value={countryId}
            onChange={(e) => setCountryId(e.target.value)}
          />
          <input type="submit" value="Buscar" />
        </form>
        <div className="cards">
        {details.length ? (
          details.map((e) => {
            return (
              <div key={e.id} className="card">
                <Link to={`/country/${e.id}`} className="link">
                  <div >
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
          <span>Ingresa nombre o id de pais</span>
        )}
        </div>
      </div>
    </div>
  );
}
