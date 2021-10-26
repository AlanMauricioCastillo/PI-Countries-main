import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
//import { getPaged } from "../../actions/getPaged";
//import { filtrarPokemonNoPropios } from "../../actions/filtrarPokemonNoPropios";
//import { useDispatch } from "react-redux";
//import { useEffect } from "react";
//import { orderAsc } from "../../actions/orderAsc";
//import { getOwn } from "../../actions/getOwn";
//import { typeFilter } from "../../actions/typeFilter";
//import { filterApi } from "../../actions/filterApi";
//import { orderDes } from "../../actions/orderDes";
//import { forceAsc } from "../../actions/forceAsc";
//import { forceDes } from "../../actions/forceDes";
//import {clearDetails} from "../../actions/clearDetails"
//import { getThemAll } from "../../actions/getThemAll";
//import PokemonDetails from "../Pokemon details/PokemonDetails";
import "./Main.css";

export default function Main() {
  /* const dispatch = useDispatch();
  const [showFilterBar, setShowFilterBar] = React.useState("Start");
  const [pageFrom, setPageFrom] = React.useState("");
  const [serchTipes, setSerchTypes] = React.useState("");
  const [tiposLState, setTiposLState] = React.useState([]);
  const [filtrando, setFiltrando] = React.useState("");
  const [typeFilters, setTypeFilters] = React.useState([]);
  const [hide, setHide] = React.useState("all");
  //const [paged, setPaged] = React.useState("");
  //const [pagedApi, setPagedApi] = React.useState("");
  const [update, setUpdate] = React.useState("");
  const [pag, setpag] = React.useState("");
  const [pokemonsOnscreen, setpokemonsOnscreen] = React.useState("");
  const [own, setOwn] = React.useState("");
  // eslint-disable-next-line no-unused-vars
  const [input, setInput] = React.useState({
    alfabetico: "",
    fuerza: "",
    tipos: "",
    procedencia: "",
  });

  var tiposGState = useSelector((state) => state.pokemonsTypes);
  var Pokemons = useSelector((state) => state.pokemons);
  var PokemonsNoP = useSelector((state) => state.pokemonsFilter);
  var pokemonsPropios = useSelector((state) => state.pokemonsPropios);

  useEffect(() => {
    setTiposLState(tiposGState);
  }, [tiposGState]);

  useEffect(() => {
    setpokemonsOnscreen(Pokemons);
  }, [Pokemons]);
  useEffect(() => {
    if (!Pokemons.pokemons && Pokemons.length < 1) {
      dispatch(getThemAll());
    }
    if (pageFrom === "") {
      dispatch(getThemAll());
      //setPageFrom("Mix")
    }
    if (pageFrom === "Mix") {
      setFiltrando("");
      //setpag("")
      //dispatch(getThemAll())
      for (let i = 0; i < pokemonsPropios.length; i++) {
        PokemonsNoP.pokemons.unshift(pokemonsPropios[i]);
      }
      let set = new Set(PokemonsNoP.pokemons.map(JSON.stringify));
      let arrSinDuplicaciones = Array.from(set).map(JSON.parse);
      setpokemonsOnscreen(arrSinDuplicaciones);
      setpag(1);
      setFiltrando(PokemonsNoP.pokemons);
    }
    if (pageFrom === "Own") {
      setFiltrando("");
      setpokemonsOnscreen(Pokemons);
      setFiltrando(pokemonsPropios);
    }
    if (pageFrom === "Alien") {
      setFiltrando("");
      //setpag("")
      setpokemonsOnscreen(PokemonsNoP);
      //setpag(1)
      setFiltrando(PokemonsNoP.pokemons);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageFrom]);

  useEffect(() => {
    if (serchTipes !== "") {
      dispatch(typeFilter({ pokemons: serchTipes }));
    }
    setSerchTypes("");
  }, [dispatch, serchTipes]);

  useEffect(() => {
    if (update === "back to basic") {
      dispatch(getThemAll());
      setUpdate("");
      dispatch(getOwn());
    }
  }, [dispatch, update]);

  useEffect(() => {
    let pagF = parseInt(pag, 10);
    let set = new Set(PokemonsNoP.pokemons.map(JSON.stringify));
    let arrSinDuplicaciones = Array.from(set).map(JSON.parse);

    let arr = [];

    if (pageFrom === "Own") {
      const dataArr = new Set(pokemonsPropios);
      arr = [...dataArr];
    } else if (pageFrom === "Alien") {
      let filt = arrSinDuplicaciones.filter((e) => typeof e.id === "number");
      if (pagF === 4) {
        for (let i = 36; i < 40; i++) {
          arr.push(filt[i]);
        }
      } else {
        for (let i = pagF * 12 - 12; i < pagF * 12; i++) {
          let sum = i + 1;
          arr.push(filt[sum]);
        }
      }
    } else if (pageFrom === "Mix") {
      let count = pokemonsPropios.length < 5 ? pokemonsPropios.length : 4;
      if (pagF !== 4 && pagF !== 1) {
        for (
          let i = pagF * 12 - 12 + count - 3;
          i < pagF * 12 + count - 3;
          i++
        ) {
          let sum = i + 1;
          arr.push(arrSinDuplicaciones[sum]);
        }
      }
      if (pagF === 4) {
        let count = pokemonsPropios.length < 5 ? pokemonsPropios.length : 4;
        for (let i = 36 + count - 3; i < 40 + count - 1; i++) {
          let sum = i + 1;
          arr.push(arrSinDuplicaciones[sum]);
        }
      }
      if (pagF === 1) {
        for (let i = pagF - 1; i < 12; i++) {
          arr.push(arrSinDuplicaciones[i]);
        }
      }
    }
    setpokemonsOnscreen({ pokemons: arr });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pag, pageFrom, PokemonsNoP.pokemons]);

  useEffect(() => {
    if (own !== "") {
      //console.log(pokemonsPropios)
      if (pokemonsPropios.length < 1) {
        //dispatch(filterApi());
        dispatch(getOwn());
        alert("¡no thing here!");
      } else {
        let pokemons = [];
        for (let i = 0; i < pokemonsPropios.length; i++) {
          pokemons.push({
            id: pokemonsPropios[i].id,
            name: pokemonsPropios[i].Nombre,
            types: pokemonsPropios[i].Types.map((tipo) => tipo.Nombre),
            imagen: pokemonsPropios[i].Imagen,
            fuerza: pokemonsPropios[i].Fuerza,
          });
        }
        setpokemonsOnscreen({ pokemons: pokemons });
        setOwn("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [own, pokemonsPropios]);

  const hendlestate = (e) => {
    if (e === "main") {
      setUpdate("back to basic");
      setHide("nones");
    }
  };

  const hendleChange = (e) => {
    if (e.target.value === "none") {
      setInput((prev) => ({ ...prev, [e.target.name]: "" }));
    } else {
      setInput((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const HendleChangeOnFilters = (e) => {
    const comand = e.target.value;
    if (comand === "none" || comand === "refresh") {
      tiposLState.forEach((element) => {
        document.getElementById(element.Nombre).style.backgroundColor = "white";
      });
      setTypeFilters([]);
    }
    if (e.target.name === "procedencia" && comand === "none") {
      if (
        PokemonsNoP.pokemons !== undefined &&
        PokemonsNoP.pokemons.length < 1
      ) {
        setHide("api");
        setUpdate("back to basic");
      }
    }
    if (comand === "A-Z" && pageFrom === "Own") {
      pokemonsPropios.sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        } else {
          return -1;
        }
      });
    }
    if (comand === "A-Z" && pageFrom === "Alien") {
      setpag("");
      PokemonsNoP.pokemons.sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        } else {
          return -1;
        }
      });
      setpag(1);
    }
    if (comand === "A-Z" && pageFrom === "Mix") {
      setpag("");
      PokemonsNoP.pokemons.sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        } else {
          return -1;
        }
      });
      setpag(1);
    }
    if (comand === "Z-A" && pageFrom === "Own") {
      pokemonsPropios.sort((a, b) => {
        if (a.name < b.name) {
          return 1;
        } else {
          return -1;
        }
      });
    }
    if (comand === "Z-A" && pageFrom === "Alien") {
      setpag("");
      PokemonsNoP.pokemons.sort((a, b) => {
        if (a.name < b.name) {
          return 1;
        } else {
          return -1;
        }
      });
      setpag(1);
    }
    if (comand === "Z-A" && pageFrom === "Mix") {
      setpag("");
      PokemonsNoP.pokemons.sort((a, b) => {
        if (a.name < b.name) {
          return 1;
        } else {
          return -1;
        }
      });
      setpag(1);
    }
    if (comand !== "A-Z" && comand !== "Z-A") {
      setInput((prev) => ({
        ...prev,
        alfabetico: "",
      }));
    }
    if (comand === "Mayor" && pageFrom === "Own") {
      pokemonsPropios.sort((a, b) => {
        if (a.fuerza < b.fuerza) {
          return 1;
        } else {
          return -1;
        }
      });
    }
    if (comand === "Mayor" && pageFrom === "Alien") {
      setpag("");
      PokemonsNoP.pokemons.sort((a, b) => {
        if (a.fuerza < b.fuerza) {
          return 1;
        } else {
          return -1;
        }
      });
      setpag(1);
    }
    if (comand === "Mayor" && pageFrom === "Mix") {
      setpag("");
      PokemonsNoP.pokemons.sort((a, b) => {
        if (a.fuerza < b.fuerza) {
          return 1;
        } else {
          return -1;
        }
      });
      setpag(1);
    }
    if (comand === "Menor" && pageFrom === "Own") {
      pokemonsPropios.sort((a, b) => {
        if (a.fuerza > b.fuerza) {
          return 1;
        } else {
          return -1;
        }
      });
    }
    if (comand === "Menor" && pageFrom === "Alien") {
      setpag("");
      PokemonsNoP.pokemons.sort((a, b) => {
        if (a.fuerza > b.fuerza) {
          return 1;
        } else {
          return -1;
        }
      });
      setpag(1);
    }
    if (comand === "Menor" && pageFrom === "Mix") {
      setpag("");
      PokemonsNoP.pokemons.sort((a, b) => {
        if (a.fuerza > b.fuerza) {
          return 1;
        } else {
          return -1;
        }
      });
      setpag(1);
    }
    if (comand !== "Mayor" && comand !== "Menor") {
      setInput((prev) => ({
        ...prev,
        fuerza: "",
      }));
    }
    if (comand === "Preexistentes") {
      if (
        typeof PokemonsNoP.pokemons === "object" &&
        PokemonsNoP.pokemons.length > 0
      ) {
        let pagination = document.getElementById("pagination");
        pagination.style.display = "inline-block";
        setpag(2);
        setPageFrom("Alien");
        //setHide("api");
      } else {
        dispatch(filterApi());
        alert("aun esperando el respond!");
      }
    }
    if (comand === "Creados") {
      //setFiltrando("")
      let pagination = document.getElementById("pagination");
      pagination.style.display = "none";
      setPageFrom("Own");
      setHide("nones");

      if (pokemonsPropios.length < 1) {
        alert("¡no thing here!");
      } else {
        setHide("nones");
      }
    }
    if (comand === "none") {
      setFiltrando("");
      setPageFrom("Mix");
      let pagination = document.getElementById("pagination");
      pagination.style.display = "inline-block";
      setHide("nones");
    }
    if (comand !== "Creados" && comand !== "Preexistentes") {
      setInput((prev) => ({
        ...prev,
        procedencia: "",
      }));
    }
    if (e.target.name === "tipos" && comand !== "refresh") {
      let arr;
      if (!typeFilters.includes(comand)) {
        document.getElementById(comand).style.backgroundColor = "red";
        setTypeFilters((prev) => [...prev, comand]);
      } else {
        arr = typeFilters.filter((e) => e !== comand);
        setTypeFilters(arr);
        document.getElementById(comand).style.backgroundColor = "white";
        if (arr.length < 1) {
          setpag(1);
        }
      }
    }
  };

  const hendleTypeFilter = () => {
    if (filtrando.length > 0) {
      console.log(filtrando);
      let arre = [];
      for (let i = 0; i < filtrando.length; i++) {
        for (let f = 0; f < filtrando[i].Types.length; f++) {
          console.log(filtrando[i].Types);
          for (let j = 0; j < typeFilters.length; j++) {
            if (filtrando[i].Types[f].includes(typeFilters[j])) {
              arre.push(filtrando[i]);
            }
          }
        }
      }
      let set = new Set(arre.map(JSON.stringify));
      let arrSinDuplicaciones = Array.from(set).map(JSON.parse);
      console.log(arrSinDuplicaciones);
      setSerchTypes(arrSinDuplicaciones);
      setpokemonsOnscreen(arrSinDuplicaciones);
    }
  };

  function handlehide(e) {
    let bar = document.getElementById("hide-me");
    let pagination = document.getElementById("pagination");
    if (showFilterBar === "Main") {
      setUpdate("back to basic");
      setpag(2);
      bar.style.display = "none";
      pagination.style.display = "none";
    } else {
      setShowFilterBar("Start");
      if (showFilterBar === "Start") {
        setPageFrom("Mix");
        setpag("");
      }
      dispatch(getOwn());
      bar.style.display = "inline-block";
      pagination.style.display = "inline-block";
    }
  } */

  return (
    <div className="big">
      MAIN
    </div>
  );
}
