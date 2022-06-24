var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var path = require("path");
var uuid = require("uuid-random");

const {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
  names,
} = require("unique-names-generator");
// Running our server on port 3080
const PORT = process.env.PORT || 3080;

const server = app.listen(PORT, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log("Listening at http://%s:%s", "localhost:", port);
});

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const io = require("socket.io")(server);

var scoreboardData = [];
var connectedClients = {};

io.on("connection", (client) => {
  console.log("New client connected");

  //Client Sent a message
  client.on("SendMessage", (messageData) => {
    scoreboardData.push(messageData);
    sendUpdatedscoreboardData(client);
  });

  //Client entered The chat Room
  client.on("UserEnteredRoom", (userData) => {
    var enteredRoomMessage = {
      message: `${userData.username} has entered the chat`,
      username: "",
      userID: 0,
      timeStamp: null,
    };
    scoreboardData.push(enteredRoomMessage);
    sendUpdatedscoreboardData(client);
    connectedClients[client.id] = userData;
  });

  //Creating identity for new connected user
  client.on("CreateUserData", () => {
    let userID = uuid();
    let username = uniqueNamesGenerator({ dictionaries: [adjectives, names] });
    var userData = { userID: userID, username: username };
    client.emit("SetUserData", userData);
  });

  //Player Disconnecting from chat room...
  client.on("disconnecting", (data) => {
    console.log("Client disconnecting...");

    if (connectedClients[client.id]) {
      var leftRoomMessage = {
        message: `${connectedClients[client.id].username} has left the chat`,
        username: "",
        userID: 0,
        timeStamp: null,
      };
      scoreboardData.push(leftRoomMessage);
      sendUpdatedscoreboardData(client);
      delete connectedClients[client.id];
    }
  });

  //Clearing Chat room data from server
  client.on("ClearChat", () => {
    scoreboardData = [];
    console.log(scoreboardData);
    sendUpdatedscoreboardData(client);
  });
});

//Sending update chat room data to all connected clients
function sendUpdatedscoreboardData(client) {
  client.emit("RetrieveScoreboardData", scoreboardData);
  client.broadcast.emit("RetrieveScoreboardData", scoreboardData);
}
