import React from "react";
import { useNavigate } from "react-router-dom";
import "./GameCard.css";

const GameCard = ({ title, description, route }) => {
  const navigate = useNavigate();

  return (
    <div className="game-card" onClick={() => navigate(route)}>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};

export default GameCard;
