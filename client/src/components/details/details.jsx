import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getFromId } from "../../actions/getFromId";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import "./details.css";

export default function Details() {
  const { countryId } = useParams();
  
  const dispatch = useDispatch();
  var country = useSelector((state) => state.countriesDetail);
  useEffect(() => {
      dispatch(getFromId(countryId));
  }, [countryId, dispatch]);

  const {
    name,
    id,
    flag,
    capital,
    continent,
    subregion,
    population,
    area,
    Activities,
    map,
  } = country[0];

  return (
    <div className="big">
      <div className="pokemon-detail">
        {country[0].name ? (
          <div className="description">
            <div className="titledetails">
              <h1>{name}</h1>
            </div>
            <img src={flag} alt={"im"} width="300px" height="200px" />
            <div className="cardanolo">
              <h2>Id: {id}</h2>
              <h2>Capital: {capital}</h2>
              <h2 className="titleCapitalized">Continent: {continent}</h2>
              <h2>Subregion: {subregion}</h2>
              <h2>Population: {population}</h2>
              <h2>Area: {area}Km²</h2>
              <Link to="/country"></Link>
              <a href={map} target="_blank" rel='noreferrer'>Map</a>
            </div>
            <h2>Activities</h2>
            <hr />
            <div className="cardanolo">
              <div className="cards">
                {Activities.length > 0 ? (
                  Activities.map((e, i) => {
                    return (
                      <div className="card" key={i}>
                        <h3 className="titleCapitalized">{e.name}</h3>
                        <span>{e.about}</span>
                        <h4>Duracion de {e.duration} Mes/es</h4>
                        <h4>Dificultad nivel: {e.difficulty}</h4>
                        <hr />
                      </div>
                    );
                  })
                ) : (
                  <span>Activities: No Activity associated</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    </div>
  );
}
