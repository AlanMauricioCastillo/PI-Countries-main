import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getFavorites, removeFavorite } from "../../actions/favorites";
import "./FavoritesPage.css";

export default function FavoritesPage() {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(getFavorites());
    }
  }, [token, dispatch]);

  const handleRemove = (countryId) => {
    dispatch(removeFavorite(countryId));
  };

  if (!token) {
    return (
      <div className="favorites-page">
        <h2>Favorites</h2>
        <p>Please <Link to="/login">login</Link> to see your favorites.</p>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <h2>My Favorite Countries</h2>
      {favorites.length === 0 ? (
        <p>No favorites yet. Browse countries and add some!</p>
      ) : (
        <div className="cards">
          {favorites.map((c) => (
            <div key={c.id} className="card">
              <Link to={`/country/${c.id}`} className="link">
                <div>
                  <img className="imagen" src={c.flag} alt={c.name} />
                  <h3>{c.name}</h3>
                  <h5>{c.continent}</h5>
                </div>
              </Link>
              <button className="remove-fav" onClick={() => handleRemove(c.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
