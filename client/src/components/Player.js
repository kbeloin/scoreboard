import React from "react";
import Counter from "./Counter";
import Icon from "./Icon";

export const Player = ({
  name,
  id,
  score,
  removePlayer,
  changeScore,
  isHighScore,
}) => {
  return (
    <div className="player">
      <span className="player-name">
        <button className="remove-player" onClick={() => removePlayer(id)}>
          ✖
        </button>

        {name}
        <Icon isHighScore={isHighScore} />
      </span>

      <Counter score={score} id={id} changeScore={changeScore} />
    </div>
  );
};

export default Player;
