import React, { Component } from "react";
import { useState, useContext } from "react";
import { SocketContext } from "../context/socket";

export const AddPlayerForm = (props) => {
  const [name, setName] = useState("");
  const socket = useContext(SocketContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("AddPlayer", name);
    setName("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Add Player</button>
    </form>
  );
};

export default AddPlayerForm;
