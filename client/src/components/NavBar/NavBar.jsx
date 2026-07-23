import React from "react";
import { NavLink } from "react-router-dom";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./Navbar.css";

export default function NavBar() {
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
          </li>
        </ul>
      </nav>
      <ThemeToggle />
    </header>
  );
}
