const http = require("http");
const socketIo = require("socket.io");
const players = require("../test/players");
const { send } = require("process");

module.exports = (app) => {
  const server = http.createServer(app);
  const io = socketIo(server);
  const port = process.env.PORT || 3001;

  var chatRoomData = [];
  var connectedClients = [];

  io.on("connection", (client) => {
    function sendResponse(event, data, client) {
      client.emit(event, data);
      client.broadcast.emit(event, data);
    }
    console.log("New client connected");

    require("./time")(client, sendResponse);
    require("./players")(client, sendResponse);

    //Client requests current server state
    client.on("SendMessage", (messageData) => {
      chatRoomData.push(messageData);
      sendUpdatedChatRoomData(client);
    });

    client.on("UserEnteredRoom", (userData) => {
      var enteredRoomMessage = {
        message: `${userData.username} has entered the chat`,
        username: "",
        userID: 0,
        timeStamp: null,
      };
      chatRoomData.push(enteredRoomMessage);
      sendUpdatedChatRoomData(client);
      connectedClients[client.id] = userData;
    });

    client.on("CreateUserData", () => {
      let userID = uuid();
      let username = uniqueNamesGenerator({
        dictionaries: [adjectives, names],
      });
      var userData = { userID: userID, username: username };
      client.emit("SetUserData", userData);
    });

    client.on("ClearChat", () => {
      chatRoomData = [];
      console.log(chatRoomData);
      sendUpdatedChatRoomData(client);
    });

    client.on("disconnecting", (data) => {
      console.log("Client disconnecting...");

      if (connectedClients[client.id]) {
        var leftRoomMessage = {
          message: `${connectedClients[client.id].username} has left the chat`,
          username: "",
          userID: 0,
          timeStamp: null,
        };
        chatRoomData.push(leftRoomMessage);
        sendUpdatedChatRoomData(client);
        delete connectedClients[client.id];
      }
    });
  });

  function sendUpdatedChatRoomData(client) {
    client.emit("RetrieveChatRoomData", chatRoomData);
    client.broadcast.emit("RetrieveChatRoomData", chatRoomData);
  }

  server.listen(port, () => console.log(`Listening on port ${port}`));
};
