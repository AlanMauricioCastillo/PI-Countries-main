import "./Paginado.css";
import React from "react";

export default function Paginado({ countriesPerPage, countries, paginate }) {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(countries / countriesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="foot">
      <nav className="empty">
        <ul className="paginado">
          {countries >= 9 &&
            pageNumbers.map((number, i) => {
              return (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a key={i} onClick={() => paginate(number)}>
                  {number}
                </a>
              );
            })}
        </ul>
      </nav>
    </div>
  );
}
