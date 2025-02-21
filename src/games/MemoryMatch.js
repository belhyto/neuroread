import React, { useState, useEffect, useCallback } from "react";
import "./MemoryMatch.css";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const words = ["happy", "brave", "fast", "bright", "calm", "smart", "strong", "kind"];

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function playAudio(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

function MemoryMatch() {
  const [gameStarted, setGameStarted] = useState(false);
  const [theme, setTheme] = useState("letters");
  const [gridSize, setGridSize] = useState(4);
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [paused, setPaused] = useState(false);
  const [bestTime, setBestTime] = useState(localStorage.getItem("bestTime") || "--");
  const [gamesPlayed, setGamesPlayed] = useState(Number(localStorage.getItem("gamesPlayed")) || 0);

  const initializeGame = useCallback(() => {
    let selectedItems = theme === "letters" ? letters.slice(0, (gridSize * gridSize) / 2) : words.slice(0, (gridSize * gridSize) / 2);
    const shuffled = shuffleArray([...selectedItems, ...selectedItems].map((item, index) => ({ value: item, id: index })));
    setCards(shuffled);
    setMoves(0);
    setMatchedCards([]);
    setSelectedCards([]);
    setStartTime(Date.now());
    setEndTime(null);
  }, [theme, gridSize]);

  useEffect(() => {
    if (gameStarted) initializeGame();
  }, [gameStarted, initializeGame]);

  const handleCardClick = (card) => {
    if (selectedCards.length < 2 && !selectedCards.includes(card)) {
      setSelectedCards([...selectedCards, card]);
      setMoves(moves + 1);
      playAudio(card.value);
    }
  };

  useEffect(() => {
    if (selectedCards.length === 2) {
      if (selectedCards[0].value === selectedCards[1].value) {
        setMatchedCards(prev => [...prev, selectedCards[0].id, selectedCards[1].id]);
      }
      setTimeout(() => setSelectedCards([]), 1000);
    }
  }, [selectedCards]);

  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
      setEndTime(Date.now());
      const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
      if (bestTime === "--" || elapsedTime < bestTime) {
        setBestTime(elapsedTime);
        localStorage.setItem("bestTime", elapsedTime);
      }
      setGamesPlayed(prev => {
        const newCount = prev + 1;
        localStorage.setItem("gamesPlayed", newCount);
        return newCount;
      });
    }
  }, [matchedCards, cards.length, startTime, bestTime]);

  return (
    <div className="memory-match">
      {!gameStarted ? (
        <div className="start-screen">
          <p>Select Theme</p>
          <button className={theme === "letters" ? "selected" : ""} onClick={() => setTheme("letters")}>Letters</button>
          <button className={theme === "words" ? "selected" : ""} onClick={() => setTheme("words")}>Words</button>
          <p>Grid Size</p>
          <button className={gridSize === 4 ? "selected" : ""} onClick={() => setGridSize(4)}>4 x 4</button>
          <button className={gridSize === 6 ? "selected" : ""} onClick={() => setGridSize(6)}>6 x 6</button>
          <button className="start-btn" onClick={() => setGameStarted(true)}>Start Game</button>
        </div>
      ) : matchedCards.length === cards.length ? (
        <div className="end-screen">
          <h1>You did it!</h1>
          <p>Game over! Here's how you got on...</p>
          <p>Time Elapsed: {((endTime - startTime) / 1000).toFixed(2)}s</p>
          <p>Moves Taken: {moves} Moves</p>
          <p>Best Time: {bestTime}s</p>
          <p>Games Played: {gamesPlayed}</p>
          <button onClick={() => setGameStarted(false)}>New Game</button>
        </div>
      ) : (
        <div>
          <h2>Memory Match Game</h2>
          <p>Moves: {moves}</p>
          <button onClick={() => setPaused(!paused)}>{paused ? "Resume" : "Pause"}</button>
          <button onClick={() => setGameStarted(false)}>End Game</button>
          {!paused && (
            <div className="grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 100px)` }}>
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`card ${selectedCards.includes(card) || matchedCards.includes(card.id) ? "flipped" : ""}`}
                  onClick={() => handleCardClick(card)}
                  style={{ borderRadius: "50%" }}
                >
                  {selectedCards.includes(card) || matchedCards.includes(card.id) ? card.value : "?"}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MemoryMatch;
