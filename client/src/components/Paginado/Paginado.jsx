import "./Paginado.css";
import React from "react";

export default function Paginado({ countriesPerPage, countries, paginate }) {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(countries / countriesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="nav">
      <ul className="paginado">
        {pageNumbers.map((number, i) => {
          return <button key={i} onClick={() => paginate(number)}>{number}</button>;
        })}
      </ul>
    </nav>
  );
}
