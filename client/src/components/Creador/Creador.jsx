import React from "react";
/* import Validador from "./Validador.js";
import { useSelector } from "react-redux";
import { newPokemon } from "../../actions/newPokemon";
import { getThemAll } from "../../actions/getThemAll";
import { useEffect } from "react";
import { getOwn } from "../../actions/getOwn"; */
//import { useDispatch } from "react-redux";
import "./Creador.css";

export default function Creador() {
  /* const dispatch = useDispatch();
  const [creado, setCreado] = React.useState([]);
  const [typeFilters, setTypeFilters] = React.useState([]);
  const [update, setUpdate] = React.useState("");
  var tiposGState = useSelector((state) => state.pokemonsTypes);
  var tipos = useSelector((state) => state.pokemonsTypes);
  var creations = useSelector((state) => state.pokemonsPropios);
  const [tiposLState, setTiposLState] = React.useState([]);
  //const [hide, setHide] = React.useState("all");
  const [call, setCall] = React.useState("");
  //const [render, setRender] = React.useState("");
  const [input, setInput] = React.useState({
    Nombre: "",
    Vida: "",
    Fuerza: "",
    Defensa: "",
    Velocidad: "",
    Imagen: "",
    Altura: "",
    Peso: "",
    types: "",
  });
  const [prevew, setPrevew] = React.useState({
    name: "",
    hp: "",
    att: "",
    def: "",
    speed: "",
    img: "",
    height: "",
    weig: "",
    type: "",
  });

  const [errors, setErrors] = React.useState({});

  const handleInputChangeTypes = (e) => {
    setTypeFilters([]);
    let ar = [];
    let arr = [];
    let comand = e.target.value;
    ar.push(comand);
    if (!typeFilters.includes(comand)) {
      document.getElementById(comand).style.backgroundColor = "red";
      setTypeFilters((prev) => [...prev, comand]);
    } else {
      arr = typeFilters.filter((e) => e !== comand);
      setTypeFilters(arr);
      document.getElementById(comand).style.backgroundColor = "white";
      if (arr.length < 1) {
        setUpdate("back to basic");
      }
    }
    if (comand === "none") {
      tiposLState.forEach((element) => {
        document.getElementById(element.Nombre).style.backgroundColor = "white";
      });
      setTypeFilters([]);
      setUpdate("back to basic");
    }

    let value = [...input.types];
    if (!input.types.includes(e.target.value)) value.push(e.target.value);
    setInput((prev) => ({
      ...prev,
      types: value,
    }));
  };

  const handlePrevew = (e) => {
    if (creado.includes(input.Nombre)) {
      hendleRefresh();
      alert("¡el pokemon ya existe!");
    } else {
      let arr = [];
      if (input.types) {
        arr = input.types.filter((e, i) => {
          return input.types.indexOf(e) === i;
        });
      }
      setPrevew((prev) => ({
        ...prev,
        name: input.Nombre,
        hp: input.Vida,
        att: input.Fuerza,
        def: input.Defensa,
        speed: input.Velocidad,
        img: input.Imagen,
        height: input.Altura,
        weig: input.Peso,
        type: arr,
      }));
    }
  };

  const handleInputChange = (e) => {
    setInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    let objError = Validador({ ...input, [e.target.name]: e.target.value });
    setErrors(objError);
  };

  const hendleRefresh = (e) => {
    setInput({
      Nombre: "",
      Vida: "",
      Fuerza: "",
      Defensa: "",
      Velocidad: "",
      Imagen: "",
      Altura: "",
      Peso: "",
      types: [],
    });
    setPrevew((prev) => ({
      ...prev,
      name: "",
      hp: "",
      att: "",
      def: "",
      speed: "",
      img: "",
      height: "",
      weig: "",
      type: "",
    }));
    typeFilters.forEach((e) => {
      document.getElementById(e).style.backgroundColor = "white";
    });
    dispatch(getThemAll());
  };

  //console.log(creations);
  useEffect(() => {
    if (creations.pokemons) {
      dispatch(getThemAll());
      dispatch(getOwn());
    }
    if (call !== "") {
      dispatch(newPokemon(input));
      setCall("");
      //alert("¡Well done Pokemon created!");
      hendleRefresh();
      dispatch(getThemAll());
    }
  }, [call]);

  useEffect(() => {
    setTiposLState(tiposGState);
  }, [tiposGState]);

  const {
    Nombre,
    Vida,
    Fuerza,
    Defensa,
    Velocidad,
    Imagen,
    Altura,
    Peso,
    types,
  } = input;
  const { name, hp, att, def, speed, img, height, weig, type } = prevew;
  */ return (
    <div className="big">
      {/* <h2>Crea a tu Pokemon</h2>
      <form
        className="form"
        id="form1"
        onSubmit={(e) => {
          e.preventDefault();
          handlePrevew();
        }}
      >
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="Nombre"
            className={errors.Nombre && "danger"}
            onChange={handleInputChange}
            value={input.Nombre}
          />
          {errors.Nombre && !Nombre && (
            <p className="danger">{errors.Nombre}</p>
          )}
        </div>
        <p>
          <label>Vida:</label>
          <input
            type="number"
            min="1"
            step="1"
            name="Vida"
            onChange={handleInputChange}
            value={Vida}
          />
        </p>
        <p>
          <label>Fuerza:</label>
          <input
            type="number"
            min="1"
            step="1"
            name="Fuerza"
            onChange={handleInputChange}
            value={Fuerza}
          />
        </p>
        <p>
          <label>Defensa:</label>
          <input
            type="number"
            min="1"
            step="1"
            name="Defensa"
            onChange={handleInputChange}
            value={Defensa}
          />
        </p>
        <p>
          <label>Velocidad:</label>
          <input
            type="number"
            min="1"
            step="1"
            name="Velocidad"
            onChange={handleInputChange}
            value={Velocidad}
          />
        </p>
        <p>
          <label>Imagen:</label>
          <input
            type="url"
            name="Imagen"
            onChange={handleInputChange}
            value={Imagen}
          />
        </p>
        <p>
          <label>Altura:</label>
          <input
            type="number"
            min="1"
            step="1"
            name="Altura"
            onChange={handleInputChange}
            value={Altura}
          />
        </p>
        <p>
          <label>Peso:</label>
          <input
            type="number"
            min="1"
            step="1"
            name="Peso"
            onChange={handleInputChange}
            value={Peso}
          />
        </p>
        <div>
          <label>Tipo/s:</label>
          <select value="Tipo" onChange={handleInputChangeTypes}>
            <option value="none">Choose</option>
            {tipos.map((e, i) => {
              return (
                <option
                  id={e.Nombre}
                  key={i}
                  value={`${e.Nombre}`}
                >{`${e.Nombre}`}</option>
              );
            })}
          </select>
          <input
            type="button"
            id="refresh"
            value="refresh"
            onClick={(e) => {
              e.preventDefault();
              hendleRefresh(e);
            }}
            name="type"
          />
        </div>

        <input
          onChange={(e) => {
            e.preventDefault();
            handlePrevew();
          }}
          id="submitPrevew"
          type="submit"
          name="Prevew"
          value="Prevew"
        />
      </form>
      <div id="prevew" className="crea-containers">
        {name ? (
          <div className="crea-containers">
            <div className="cardano">
              <h1>{name}</h1>
              <img src={img} alt={"im"} className="img" />
            </div>
            <div className="text">
              <h2>Fuerza: {att}</h2>
              <h2>Defensa: {def}</h2>
              <h2>Altura: {height}</h2>
              <h2>Peso: {weig}</h2>
              <h2>Velocidad: {speed}</h2>
              <h2>Vida: {hp}</h2>
              <div className="cardano">
                <h2>
                  Tipo/s:{" "}
                  {input.types ? (
                    input.types.map((e, i) => {
                      return <div key={i}>{e}</div>;
                    })
                  ) : (
                    <spam>No Type</spam>
                  )}
                </h2>
              </div>
              <form
                onClick={(e) => {
                  setCreado((prev) => [...prev, input.Nombre]);
                  e.preventDefault();
                  setCall("make");
                }}
              >
                <input
                  onSubmit={(e) => {
                    console.log(e.target);
                    e.preventDefault();
                  }}
                  type="submit"
                  name="Crear"
                  value="Crear"
                />
              </form>
            </div>
          </div>
        ) : (
          <div className="inProgresses" />
        )}
      </div> */}
    </div>
  );
}
