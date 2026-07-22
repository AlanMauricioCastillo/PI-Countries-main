import { BrowserRouter, Route } from "react-router-dom";
import { Switch } from "react-router";
import NavBar from "./components/NavBar/NavBar";
import FindAndFilt from "./components/Find&Filt&Ord/Find&Filt&Ord.jsx";
import Details from "./components/details/details";
import Main from "./components/Main/Main.jsx";
import Creador from "./components/Creador/Creador.jsx";
import FirsContact from "./components/Primer contacto/First contact.jsx";
import NotFound from "./components/No encontrado/NotFound";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import FavoritesPage from "./components/FavoritesPage/FavoritesPage";
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

          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register" component={RegisterPage} />
          <Route exact path="/favorites" component={FavoritesPage} />

          <Route path="*" component={NotFound} />
        </Switch>

        <Route path="/country" component={NavBar} />
        <Route path="/activityCreator" component={NavBar} />
        <Route path="/favorites" component={NavBar} />
        <Route path="/login" component={NavBar} />
        <Route path="/register" component={NavBar} />
      </div>
    </BrowserRouter>
  );
}

export default App;
