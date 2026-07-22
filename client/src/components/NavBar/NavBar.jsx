import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../actions/auth";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./Navbar.css";

export default function NavBar() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <header className="navbar">
      <nav>
        <ul className="list-item">
          <li className="list-item">
            <NavLink className="link" exact to="/country">
              Home
            </NavLink>
            <NavLink className="link" exact to="/activityCreator">
              Create
            </NavLink>
            <NavLink className="link" exact to="/favorites">
              Favorites
            </NavLink>
            {token ? (
              <button className="link logout-btn" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <>
                <NavLink className="link" exact to="/login">
                  Login
                </NavLink>
                <NavLink className="link" exact to="/register">
                  Register
                </NavLink>
              </>
            )}
          </li>
        </ul>
      </nav>
      <ThemeToggle />
    </header>
  );
}
