import { BrowserRouter, Route } from "react-router-dom";
import { Switch } from "react-router";
/* import { useDispatch } from "react-redux";
import { useEffect } from "react"; */

//import { getTypes } from "./actions/getTypes";
//import { getOwn } from "./actions/getOwn"
//import {getThemAll} from "./actions/getThemAll"
import NavBar from "./components/NavBar/NavBar";
import FindAndFilt from "./components/Find&Filt&Ord/Find&Filt&Ord.jsx";
//import Paginado from "./components/Paginado/Paginado";

import Details from "./components/details/details";
import Main from "./components/Main/Main.jsx";
import Creador from "./components/Creador/Creador.jsx";
import FirsContact from "./components/Primer contacto/First contact.jsx";
import NotFound from "./components/No encontrado/NotFound";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route exact path="/" component={FirsContact} />

          <Route exact path="/activityCreator" component={Creador} />

          <Route exact path="/country/:countryId" component={Details} />

          <Route exact path="/country">
            <FindAndFilt />
            <Main />
          </Route>

          <Route path="*" component={NotFound} />
        </Switch>

        <Route path="/country" component={NavBar} />

        <Route path="/activityCreator" component={NavBar} />
      </div>
    </BrowserRouter>
  );
}

export default App;
