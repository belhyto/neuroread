import React from "react";
import GameCard from "../components/GameCard";
import "./WelcomeScreen.css";

const WelcomeScreen = () => {
  // Only include the "Fill in the Blanks" game
  const game = {
    name: "NeuroRead ",
    route: "/fill-in-the-blanks",
    description: "Fill in the Blanks",
  };

  return (
    <div className="welcome-container"> 
      <div className="game-list">
        <GameCard key={game.route} title={game.name} description={game.description} route={game.route} />
      </div>
    </div>
  );
};

export default WelcomeScreen;