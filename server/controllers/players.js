const uuid = require("uuid-random");
let players;

module.exports = (client, sendResponse) => {
  if (players === undefined) {
    players = [];
  }

  client.emit("getPlayers", players ?? []);

  client.on("AddPlayer", (playerName) => {
    const playerId = uuid();
    players.push({
      id: playerId,
      name: playerName,
      score: 0,
    });
    sendResponse("getPlayers", players, client);
  });

  client.on("RemovePlayer", (playerId) => {
    players.splice(
      players.findIndex((player) => player.id === playerId),
      1
    );
    sendResponse("getPlayers", players, client);
  });

  client.on("ChangeScore", ({ id, delta }) => {
    players.find((player) => player.id === id).score += delta;
    sendResponse("getPlayers", players, client);
  });
};
