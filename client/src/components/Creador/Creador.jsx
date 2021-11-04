import React from "react";
import Validador from "../../Validators/ValidatorCreations";
import { getTheWorld } from "../../actions/getTheWorld";
import { newActivity } from "../../actions/newActivity";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./Creador.css";

export default function Creador() {
  const dispatch = useDispatch();
  var countries = useSelector((state) => state.reserveCountries);
  const [clear, setClear] = React.useState("");
  const [input, setInput] = React.useState({
    name: "",
    difficulty: "1",
    duration: "1",
    season: [],
    temporada: [],
    about: "",
    countriesAssociated: [],
    countryId: [],
  });
  const [errors, setErrors] = React.useState({});

  useEffect(() => {
    dispatch(getTheWorld());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clear]);

  const handleAssociationCuntryActivity = (e) => {
    let comand = e.target.value;
    if (comand !== "") {
      let found = countries.find((e) => e.name === comand);
      let valueName = [...input.countriesAssociated];
      if (found) {
        if (!input.countriesAssociated.includes(found) && found)
          valueName.push(found);
        if (!input.countryId.includes(found.id)) {
          setInput((prev) => ({
            ...prev,
            countriesAssociated: valueName,
            countryId: [...input.countryId, found.id],
          }));
        } else {
          setInput((prev) => ({
            ...prev,
            countriesAssociated: valueName,
          }));
        }
      }
    }
  };

  const resetRanges = (id) => {
    document.getElementById(id).value = 1;
  };

  useEffect(() => {
    if (clear !== "") {
      resetRanges("difficulty");
      resetRanges("duration");
      handleLabel(null);
      document.getElementById("about").value = "";
      document.getElementById("season").value = "";
      document.getElementById("datalistA").value = "";
      setInput({
        name: "",
        difficulty: "1",
        duration: "1",
        season: [],
        temporada: [],
        about: "",
        countriesAssociated: [],
        countryId: [],
      });
    }
    setClear("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clear]);

  const onClose = (e) => {
    let comand = e.target.value;
    let surce = e.target.id;
    if (surce === "countriesAssociated") {
      let aux = input.countryId.filter((e) => e !== comand);
      let aux2 = input.countriesAssociated.filter((e) => e.id !== comand);
      setInput((prev) => ({
        ...prev,
        countryId: aux,
        countriesAssociated: aux2,
      }));
    }
    if (surce === "temporada") {
      let aux = input.season.filter((e) => e !== comand);
      let aux2 = input.temporada.filter((e) => e.id !== comand);
      setInput((prev) => ({
        ...prev,
        season: aux,
        temporada: aux2,
      }));
    }
  };

  const handleSeason = (e) => {
    handleInputChange(e);
    let comand = e.target.value;
    if (comand !== "") {
      let valueName = [...input.season];
      if (!input.season.includes(comand)) valueName.push(comand);
      setInput((prev) => ({
        ...prev,
        season: valueName,
      }));
    }
  };

  const handleInputChange = (e) => {
    let comand = e.target.value;
    let valueName = [...input.temporada];
    if (comand === "summer") {
      let a = "Verano";
      if (!input.season.includes(comand)) {
        valueName.push({ name: a, id: comand });
      }
    }
    if (comand === "winter") {
      let a = "Invierno";
      if (!input.season.includes(comand)) {
        valueName.push({ name: a, id: comand });
      }
    }
    if (comand === "spring") {
      let a = "Primavera";
      if (!input.season.includes(comand)) {
        valueName.push({ name: a, id: comand });
      }
    }
    if (comand === "fall") {
      let a = "Otoño";
      if (!input.season.includes(comand)) {
        valueName.push({ name: a, id: comand });
      }
    }
    setInput((prev) => ({
      ...prev,
      temporada: [...valueName],
    }));
    if (e.target.name !== "season" && e.target.id !== "temporada") {
      setInput((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
      let objError = Validador({ ...input, [e.target.name]: e.target.value });
      setErrors(objError);
    }
  };

  const handleLabel = (e) => {
    if (e !== null) {
      handleInputChange(e);
      let id = e.target.id;
      let out = "";
      let inp = document.getElementById(id);
      if (id === "difficulty") {
        out = document.getElementById("labelDificulty");
        out.innerHTML = `Level ${inp.value}`;
      } else if (id === "duration") {
        let diference = "Months";
        if (inp.value === "1") diference = "Month";
        out = document.getElementById("labelDuration");
        out.innerHTML = `${inp.value} ${diference}`;
      }
    } else {
      let out = document.getElementById("labelDificulty");
      out.innerHTML = "";
      let out2 = document.getElementById("labelDuration");
      out2.innerHTML = "";
    }
  };

  return (
    <div className="biger">
      <div className="creadors">
        <form className="form">
          <h2 className="back">Activity Creator</h2>
          <div className="back">
            <label>Name</label>
            <input
              type="text"
              name="name"
              className={errors.Nombre && "danger"}
              onChange={handleInputChange}
              value={input.name}
            />
            {errors.Nombre && !input.name && (
              <p className="danger">{errors.Nombre}</p>
            )}
          </div>
          <p>
            <label>Dificulty</label>
            <input
              id="difficulty"
              name="difficulty"
              type="range"
              step="1"
              min="1"
              max="5"
              defaultValue="1"
              onChange={handleLabel}
            />
            <span id="labelDificulty">Level 1</span>
          </p>
          <p>
            <label>Duration</label>
            <input
              id="duration"
              name="duration"
              type="range"
              step="1"
              min="1"
              max="12"
              defaultValue="1"
              onChange={handleLabel}
            />
            <span id="labelDuration">1 Month</span>
          </p>
          <p>
            <label>Season</label>
            <select id="season" name="season" onChange={handleSeason}>
              <option value=""></option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="fall">Fall</option>
              <option value="winter">Winter</option>
            </select>
          </p>
          <p>
            <label>About</label>
            <input
              id="about"
              type="text"
              name="about"
              onChange={handleInputChange}
            />
          </p>
          <div className="back">
            <label>Countries that develop it</label>
            <input
              id="datalistA"
              name="countriesAssociated"
              className={errors.Nombre && "danger"}
              list="association"
              onClick={(e) => {
                document.getElementById("datalistA").value = "";
                document.getElementById("association").value = "";
              }}
              onChange={handleAssociationCuntryActivity}
            />
            <datalist id="association">
              {countries.map((e, i) => {
                return (
                  <option id={e.id} key={i} value={e.name}>
                    {e.id}
                  </option>
                );
              })}
            </datalist>
            {errors.Country && input.countryId.length < 1 && (
              <p className="danger">{errors.Country}</p>
            )}
          </div>
        </form>
        <div id="prevew" className="crea-containers2">
          {input.name ? (
            <div>
              <div className="cardano">
                <h1>{input.name}</h1>
              </div>
              <div className="text">
                <h2>Dificulty Level: {input.difficulty}</h2>
                <h2>Duration of {input.duration} Month/s</h2>
                <span>{input.about}</span>
                <div className="cardano">
                  <h2>Season/s</h2>
                  <div className="ca">
                    {input.temporada ? (
                      input.temporada.map((e, i) => {
                        return (
                          <div key={i}>
                            <span>{e.name}</span>
                            <button
                              id="temporada"
                              className="delete"
                              value={e.id}
                              onClick={onClose}
                            >
                              X
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <span></span>
                    )}
                  </div>
                </div>
                <div className="cardano">
                  <h2>Countries that develop it</h2>
                  <div className="ca">
                    {input.countriesAssociated ? (
                      input.countriesAssociated.map((e, i) => {
                        return (
                          <div key={i}>
                            <span>{e.name}</span>
                            <button
                              id="countriesAssociated"
                              className="delete"
                              value={e.id}
                              onClick={onClose}
                            >
                              X
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <span></span>
                    )}
                  </div>
                </div>
                {input.countryId.length > 0 ? (
                  <button
                    id="refresh"
                    className="refresh"
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(newActivity(input));
                      setClear("call");
                    }}
                  >
                    Create
                  </button>
                ) : (
                  <span></span>
                )}
              </div>
            </div>
          ) : (
            <div className="noThing" />
          )}
        </div>
      </div>
    </div>
  );
}
