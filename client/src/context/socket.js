import React, { useEffect, createContext, useState } from "react";
import socketio from "socket.io-client";
const ENDPOINT = "http://192.168.0.12:3001";

export const socket = socketio.connect(ENDPOINT);
export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [loadClient, setLoadClient] = useState(true);
  useEffect(() => {
    socket.on(
      "connect",
      () => {
        console.log("Connected to server");
      },
      [socket]
    );
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!loadClient) {
      socket.disconnect();
    } else {
      socket.connect();
    }
  }, [loadClient]);

  return (
    <>
      <button onClick={() => setLoadClient((prevState) => !prevState)}>
        {loadClient ? "STOP" : "START"} CLIENT
      </button>

      {loadClient && (
        <SocketContext.Provider value={socket}>
          {children}
        </SocketContext.Provider>
      )}
    </>
  );
};

export default SocketProvider;
