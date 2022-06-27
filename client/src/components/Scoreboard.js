import React, { useEffect, useContext, useState, createContext } from "react";
import Player from "./Player";
import Header from "./Header";
import AddPlayerForm from "./AddPlayerForm";
import { SocketContext } from "../context/socket";

// Scoreboard component manages adding and removing players from the scoreboard,
// and also manages the adding and removing of scores.
//  Keeps time in sync with the server.

const ScoreboardContext = createContext();

export const Scoreboard = (props) => {
  const socket = useContext(SocketContext);
  const [players, setPlayers] = useState([]);

  const handleRemovePlayer = (id) => {
    socket.emit("RemovePlayer", id);
  };

  const handleAddPlayer = (name) => {
    socket.emit("AddPlayer", name);
  };

  const changeScore = (id, delta) => {
    socket.emit("ChangeScore", { id: id, delta: delta });
  };

  const getHighScore = () => {
    const scores = players.map((p) => p.score);
    const highScore = Math.max(...scores);
    if (highScore) {
      return highScore;
    }
    return null;
  };

  useEffect(() => {
    socket &&
      socket.on("getPlayers", (data) => {
        setPlayers(data);
      });
  }, []);

  return (
    <ScoreboardContext.Provider value={players}>
      <div className="scoreboard">
        {socket && <Header players={players} />}
        {players.map((player, i) => (
          <Player
            key={player.id}
            index={i}
            id={player.id}
            name={player.name}
            score={player.score}
            removePlayer={handleRemovePlayer}
            changeScore={changeScore}
            isHighScore={getHighScore() === player.score}
          />
        ))}
        <AddPlayerForm addPlayer={handleAddPlayer} />
      </div>
    </ScoreboardContext.Provider>
  ); // end return
};

export default Scoreboard;
