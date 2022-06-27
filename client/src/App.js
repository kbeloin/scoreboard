import React, { useState } from "react";
import Scoreboard from "./components/Scoreboard";

import { SocketProvider, socket } from "./context/socket";

function App() {
  return (
    <>
      {/* LOAD OR UNLOAD THE CLIENT */}

      {/* SOCKET IO CLIENT*/}

      <SocketProvider>
        <Scoreboard />
      </SocketProvider>
    </>
  );
}

export default App;
