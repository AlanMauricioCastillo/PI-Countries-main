import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getFromId } from "../../actions/getFromId";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import "./details.css";

export default function Details() {
  const { countryId } = useParams();
  //console.log(countryId);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getFromId(countryId));
  }, [countryId, dispatch]);

  var country = useSelector((state) => state.countriesDetail);

  if (country.length > 0) {
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

    if (country[0].name && country[0].Activities.length > 0) {
      let arr = country[0].Activities;
      //let arr2 = [];
      for (let i = 0; i < arr.length; i++) {
        let activities = arr[i].season.map((season) => {
          let arr2 = [];
          console.log(season);
          if (season === "summer") {
            arr2.push("Verano");
          }
          if (season === "spring") {
            arr2.push("Primavera");
          }
          if (season === "winter") {
            arr2.push("Invierno");
          }
          if (season === "fall") {
            arr2.push("Otoño");
          }
          return arr2;
        });
        arr[i].temporada = activities;
      }
    }

    return (
      <div className="bigDetail">
        <div className="pokemon-detail">
          {country[0].name ? (
            <div className="description">
              <div className="titledetails">
                <h1>{name}</h1>
              </div>
              <img src={flag} alt={"im"} width="300px" height="200px" />
              <div className="cardanoloTop">
                <h2 className="titleCapitalized">Id: {id}</h2>
                <h2 className="titleCapitalized">Capital: {capital}</h2>
                <h2 className="titleCapitalized">Continent: {continent}</h2>
                <h2 className="titleCapitalized">Subregion: {subregion}</h2>
                <h2 className="titleCapitalized">Population: {population}</h2>
                <h2 className="titleCapitalized">Area: {area}Km²</h2>
                <Link to="/country"></Link>
                <a href={map} target="_blank" rel="noreferrer">
                  Map
                </a>
              </div>
              <h2>Activities</h2>
              <hr />
              <div className="cardanolo">
                <div className="divOfDetails">
                  {Activities.length > 0 ? (
                    Activities.map((e, i) => {
                      return (
                        <div className="cardInDetail" key={i}>
                          <h3 className="titleCapitalized">{e.name}</h3>
                          <span>{e.about}</span>
                          <h4>Duracion de {e.duration} Mes/es</h4>
                          <h4>Temporada/s:</h4>
                          {e.temporada.map((t, i) => {
                            return <p key={i}>{t}</p>;
                          })}
                          <h4>Dificultad nivel: {e.difficulty}</h4>
                          <hr />
                        </div>
                      );
                    })
                  ) : (
                    <span bacgrond-color="orange" >Activities: No Activity associated</span>
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
  } else {
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
    } = country;

    console.log(country);
    if (country.name && country.Activities.length > 0) {
      let arr = country.Activities;
      //let arr2 = [];
      for (let i = 0; i < arr.length; i++) {
        let activities = arr[i].season.map((season) => {
          let arr2 = [];
          console.log(season);
          if (season === "summer") {
            arr2.push("Verano");
          }
          if (season === "spring") {
            arr2.push("Primavera");
          }
          if (season === "winter") {
            arr2.push("Invierno");
          }
          if (season === "fall") {
            arr2.push("Otoño");
          }
          return arr2;
        });
        arr[i].temporada = activities;
      }
    }

    return (
      <div className="big">
        <div className="pokemon-detail">
          {country.name ? (
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
                <a href={map} target="_blank" rel="noreferrer">
                  Map
                </a>
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
                          <h4>Temporada/s:</h4>
                          {e.temporada.map((t, i) => {
                            return <p key={i}>{t}</p>;
                          })}
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
}
