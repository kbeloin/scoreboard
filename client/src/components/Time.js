import React, { useEffect, useContext, useState } from "react";
import { SocketContext } from "../context/socket";

const Time = (props) => {
  // This is how we useContext!! Similar to useState
  const socket = useContext(SocketContext);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const handleTime = (e) => {
    e.preventDefault();
    const now = Date.now();
    if (!isRunning) {
      setIsRunning(true);
      socket.emit("StartTime");
    } else {
      setIsRunning(false);
      socket.emit("StopTime");
    }
  };

  const handleReset = (e) => {
    e.preventDefault();
    setElapsedTime(0);
    socket.emit("ResetTime");
  };

  useEffect(() => {
    if (socket) {
      socket.on("SetTime", (time) => {
        setElapsedTime(time);
      });
      socket.on("StopTime", () => {
        setIsRunning(false);
      });
      socket.on("StartTime", () => {
        setIsRunning(true);
      });
    }
  }, [socket]);

  return (
    <div className="stopwatch">
      <h2>Stopwatch</h2>
      <span className="stopwatch-time">{elapsedTime}</span>
      <div className="stopwatch-controls">
        <button onClick={handleTime}>
          {isRunning ? "Stop" : elapsedTime > 0 ? "Continue" : "Start"}
        </button>
        <button disabled={isRunning} onClick={handleReset} title="Reset">
          &#x21bb;
        </button>
      </div>
    </div>
  ); // end return
};

export default Time;
