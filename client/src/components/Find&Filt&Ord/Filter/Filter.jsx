import { useDispatch } from "react-redux";
import { continentFilter } from "../../../actions/continentFilter";
import { useSelector } from "react-redux";
import React from "react";
import "../Buscador.css";
import { reRenderCountries } from "../../../actions/reRenderCountries";
import { activityFilter } from "../../../actions/activityFilter";
import { switchPaged } from "../../../actions/switchPaged";
import { useEffect } from "react";

export default function Filter() {
  const dispatch = useDispatch();
  var countries = useSelector((state) => state.reserveCountries);
  var currentPage = useSelector((state) => state.switchPaged);

  useEffect(() => {
    dispatch(reRenderCountries(countries));
  }, [countries, dispatch]);

  useEffect(() => {
    if (currentPage === "notFiltering") {
      dispatch(reRenderCountries());
    }
  }, [currentPage, dispatch]);

  let lazy = [],
    i = 2;
  while (i < 13) {
    lazy.push(i);
    i++;
  }

  const handleNameFilter = (e) => {
    let comand = e.target.value;
    if (comand !== "refresh") {
      let arr = countries.filter((e) => {
        return e.Activities.length > 0;
      });
      let arr2 = [];
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].Activities.length; j++) {
          if (arr[i].Activities[j].name === comand) {
            arr2.push(arr[i]);
          }
        }
      }
      dispatch(activityFilter(arr2));
      dispatch(switchPaged("filtering"));
    } else {
      dispatch(reRenderCountries());
      dispatch(switchPaged("notFiltering"));
    }
  };

  const handleDificultyFilter = (e) => {
    let comand = e.target.value;
    if (comand !== "refresh") {
      let arr = countries.filter((e) => {
        return e.Activities.length > 0;
      });
      let arr2 = [];
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].Activities.length; j++) {
          if (arr[i].Activities[j].difficulty === parseInt(comand, 10)) {
            arr2.push(arr[i]);
          }
        }
      }
      dispatch(activityFilter(arr2));
      dispatch(switchPaged("filtering"));
    } else {
      dispatch(reRenderCountries());
      dispatch(switchPaged("notFiltering"));
    }
  };

  const handleDurationFilter = (e) => {
    let comand = e.target.value;
    if (comand !== "refresh") {
      let arr = countries.filter((e) => {
        return e.Activities.length > 0;
      });
      let arr2 = [];
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].Activities.length; j++) {
          if (arr[i].Activities[j].duration === parseInt(comand, 10)) {
            arr2.push(arr[i]);
          }
        }
      }
      dispatch(activityFilter(arr2));
      dispatch(switchPaged("filtering"));
    } else {
      dispatch(reRenderCountries());
      dispatch(switchPaged("notFiltering"));
    }
  };

  const handleSeasonFilter = (e) => {
    let comand = e.target.value;
    if (comand !== "refresh") {
      let arr = countries.filter((e) => {
        return e.Activities.length > 0;
      });
      let arr2 = [];
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].Activities.length; j++) {
          if (arr[i].Activities[j].season.includes(comand)) {
            arr2.push(arr[i]);
          }
        }
      }
      dispatch(activityFilter(arr2));
      dispatch(switchPaged("filtering"));
    } else {
      dispatch(reRenderCountries());
      dispatch(switchPaged("notFiltering"));
    }
  };

  const handleContinentFilter = (e) => {
    let comand = e.target.value;
    if (comand !== "refresh") {
      dispatch(continentFilter(comand));
      dispatch(switchPaged("filtering"));
    } else {
      dispatch(reRenderCountries());
      dispatch(switchPaged("notFiltering"));
    }
  };

  if (countries[1] && countries[0].Activities !== undefined) {
    let arr =
      countries[0].Activities &&
      countries.filter((e) => {
        return e.Activities.length > 0;
      });
    let arr2 = arr.map((e) => e.Activities.map((e) => e.name));
    var result = arr2.flat().filter((item, index) => {
      return arr2.flat().indexOf(item) === index;
    });
  }

  return (
    <div className="space">
      <h3>Filter by Activity</h3>
      <p>
        <label>Name</label>
        <select onChange={(e) => handleNameFilter(e)}>
          <option value="refresh">All</option>
          {result &&
            result.map((e, i) => {
              return (
                <option
                  style={{ textTransform: "capitalize" }}
                  key={i}
                  value={e.toLowerCase()}
                >
                  {e[0].toUpperCase() + e.slice(1)}
                </option>
              );
            })}
        </select>
        <label>Dificulty</label>
        <select onChange={(e) => handleDificultyFilter(e)}>
          <option value="refresh">All</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>

        <label>Duration</label>
        <select onChange={(e) => handleDurationFilter(e)}>
          <option value="refresh">All</option>
          <option value="1">1 Month</option>
          {lazy.map((item, i) => {
            return (
              <option key={i} value={item}>
                {item} Months
              </option>
            );
          })}
        </select>

        <label>Season</label>
        <select onChange={(e) => handleSeasonFilter(e)}>
          <option value="refresh">All</option>
          <option value="spring">Primavera</option>
          <option value="summer">Verano</option>
          <option value="fall">Otoño</option>
          <option value="winter">Invierno</option>
        </select>
      </p>
      <div className="space">
        <h3>Filter by Continent</h3>
        <p>
          <label>Continent</label>
          <select onChange={(e) => handleContinentFilter(e)}>
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
    </div>
  );
}
