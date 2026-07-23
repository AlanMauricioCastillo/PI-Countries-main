import React from "react";
import "./NotFound.css";
import image from "./imagens.jpg";

export default function NotFound() {
  return (
    <div className="bodyse bg-page">
      <h1 className="title">Not found</h1>
      <img src={image} alt="Pikachu loader" />
    </div>
  );
}
